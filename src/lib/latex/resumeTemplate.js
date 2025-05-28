import { jsPDF } from 'jspdf';

export const exportToPdf = (data) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 0.75 * 72; // 0.75 inches in points
  const contentWidth = pageWidth - (2 * margin);
  
  // Set colors
  const primaryColor = [0, 51, 102]; // RGB for primary color
  const secondaryColor = [102, 102, 102]; // RGB for secondary color
  
  // Helper function to wrap text
  const wrapText = (text, maxWidth) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = doc.getTextWidth(currentLine + " " + word);
      if (width < maxWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  // Helper function to add section
  const addSection = (title, y) => {
    doc.setFontSize(12);
    doc.setTextColor(...primaryColor);
    doc.text(title, margin, y);
    doc.setDrawColor(...primaryColor);
    doc.line(margin, y + 2, pageWidth - margin, y + 2);
    return y + 10;
  };

  // Helper function to add heading
  const addHeading = (text, y) => {
    doc.setFontSize(11);
    doc.setTextColor(...primaryColor);
    doc.text(text, margin, y);
    return y + 5;
  };

  // Helper function to add company
  const addCompany = (text, y) => {
    doc.setFontSize(10);
    doc.setTextColor(...secondaryColor);
    doc.text(text, margin, y);
    return y + 5;
  };

  // Helper function to add duration
  const addDuration = (text, y) => {
    doc.setFontSize(10);
    doc.setTextColor(...secondaryColor);
    const textWidth = doc.getTextWidth(text);
    doc.text(text, pageWidth - margin - textWidth, y);
    return y;
  };

  // Helper function to add bullet points
  const addBulletPoints = (items, startY) => {
    let y = startY;
    items.forEach(item => {
      const lines = wrapText(item, contentWidth - 10);
      lines.forEach((line, index) => {
        if (index === 0) {
          doc.text('• ' + line, margin + 5, y);
        } else {
          doc.text(line, margin + 10, y);
        }
        y += 5;
      });
      y += 2;
    });
    return y;
  };

  // Header
  doc.setFontSize(16);
  doc.setTextColor(...primaryColor);
  doc.text(data.basics.name, pageWidth / 2, margin, { align: 'center' });

  // Contact Information
  doc.setFontSize(10);
  doc.setTextColor(...secondaryColor);
  let contactInfo = [];
  if (data.basics.location.city) contactInfo.push(data.basics.location.city);
  if (data.basics.email) contactInfo.push(data.basics.email);
  if (data.basics.phone) contactInfo.push(data.basics.phone);
  if (data.basics.url) contactInfo.push(data.basics.url);
  
  doc.text(contactInfo.join(' • '), pageWidth / 2, margin + 7, { align: 'center' });

  // Social Links
  if (data.basics.profiles && data.basics.profiles.length > 0) {
    const socialLinks = data.basics.profiles
      .filter(profile => profile.network && profile.url)
      .map(profile => `${profile.network}: ${profile.url}`)
      .join(' • ');
    doc.text(socialLinks, pageWidth / 2, margin + 14, { align: 'center' });
  }

  let y = margin + 25;

  // Summary
  if (data.basics.summary) {
    doc.setFontSize(11);
    doc.setTextColor(...primaryColor);
    doc.text('Summary:', margin, y);
    y += 5;
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const summaryLines = wrapText(data.basics.summary, contentWidth);
    summaryLines.forEach(line => {
      doc.text(line, margin, y);
      y += 5;
    });
    y += 5;
  }

  // Experience
  if (data.work && data.work.length > 0) {
    y = addSection('Experience', y);
    
    data.work.forEach(work => {
      if (work.name || work.position) {
        y = addHeading(work.position || '', y);
        y = addDuration(`${work.startDate || ''} — ${work.endDate || ''}`, y);
        y = addCompany(work.name || '', y);
        
        if (work.highlights && work.highlights.length > 0) {
          y = addBulletPoints(work.highlights, y);
        }
        y += 5;
      }
    });
  }

  // Projects
  if (data.projects && data.projects.length > 0) {
    y = addSection('Projects', y);
    
    data.projects.forEach(project => {
      if (project.name) {
        y = addHeading(project.name, y);
        if (project.description) {
          const descLines = wrapText(project.description, contentWidth);
          descLines.forEach(line => {
            doc.text(line, margin, y);
            y += 5;
          });
        }
        if (project.highlights && project.highlights.length > 0) {
          y = addBulletPoints(project.highlights, y);
        }
        y += 5;
      }
    });
  }

  // Education
  if (data.education && data.education.length > 0) {
    y = addSection('Education', y);
    
    data.education.forEach(edu => {
      if (edu.institution) {
        y = addHeading(edu.institution, y);
        y = addDuration(`${edu.startDate || ''} — ${edu.endDate || ''}`, y);
        if (edu.studyType) {
          y = addCompany(edu.studyType, y);
        }
        if (edu.area) {
          y = addCompany(edu.area, y);
        }
        y += 5;
      }
    });
  }

  // Skills
  if (data.skills && data.skills.length > 0) {
    y = addSection('Technical Skills', y);
    
    data.skills.forEach(skill => {
      if (skill.name && skill.keywords) {
        y = addHeading(skill.name, y);
        const skillText = skill.keywords.join(', ');
        const skillLines = wrapText(skillText, contentWidth);
        skillLines.forEach(line => {
          doc.text(line, margin, y);
          y += 5;
        });
        y += 5;
      }
    });
  }

  // Awards
  if (data.awards && data.awards.length > 0) {
    y = addSection('Awards', y);
    
    data.awards.forEach(award => {
      if (award.title) {
        y = addHeading(award.title, y);
        if (award.date) {
          y = addCompany(award.date, y);
        }
        if (award.summary) {
          const summaryLines = wrapText(award.summary, contentWidth);
          summaryLines.forEach(line => {
            doc.text(line, margin, y);
            y += 5;
          });
        }
        y += 5;
      }
    });
  }

  // Languages
  if (data.languages && data.languages.length > 0) {
    y = addSection('Languages', y);
    
    data.languages.forEach(lang => {
      if (lang.language) {
        const langText = `${lang.language} (${lang.fluency || ''})`;
        doc.text(langText, margin, y);
        y += 5;
      }
    });
  }

  // Interests
  if (data.interests && data.interests.length > 0) {
    y = addSection('Interests', y);
    
    data.interests.forEach(interest => {
      if (interest.name) {
        doc.text(interest.name, margin, y);
        y += 5;
      }
    });
  }

  // Save the PDF
  doc.save(`${data.basics.name.replace(/\s+/g, '_')}_Resume.pdf`);
}; 