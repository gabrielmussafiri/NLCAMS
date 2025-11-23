# Disaster Relief Assessment Form - Digital Version

This is a digitalized version of the NLC / SA Red Cross Air Mercy Services Trust (AMS) Disaster Relief Project Assessment Form.

## Features

- **Complete Form Sections**: All 9 sections from the original form are included
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Form Validation**: Required fields are validated before submission
- **Draft Saving**: Save your progress and continue later (saved in browser localStorage)
- **Data Export**: Export form data as JSON or PDF
- **User-Friendly Interface**: Modern, clean design with intuitive navigation

## How to Use

1. **Open the Form**: Simply open `index.html` in any modern web browser
2. **Fill Out the Form**: Complete all required fields (marked with a red asterisk *)
3. **Save Draft**: Click "Save Draft" to save your progress and continue later
4. **Export Data**: 
   - Click "Export as JSON" to download form data as a JSON file
   - Click "Export as PDF" to print/save as PDF using your browser's print function
5. **Submit**: Click "Submit Assessment" when complete

## Form Sections

1. **Person Details / Basic Information**: Assessment date, assessor name, location, GPS coordinates, assessment type
2. **Disaster Details**: Type of disaster, occurrence date/time, incident description
3. **Population Affected**: Statistics on affected households, individuals, casualties
4. **Damage Assessment**: Shelter/housing damage, infrastructure impact, livelihood impact
5. **Immediate Needs Identified**: Priority needs and urgency assessment
6. **Health & Safety Assessment**: Health risks and environmental hazards
7. **Community Resources & Capacities**: Local stakeholders and existing capacities
8. **Recommended Response Plan**: Immediate and short-term recommendations
9. **Verification**: Assessor signature and supervisor review

## Technical Details

- **HTML5**: Semantic markup with proper form elements
- **CSS3**: Modern styling with gradients, animations, and responsive design
- **JavaScript**: Form handling, validation, localStorage for drafts, and data export
- **No Dependencies**: Pure HTML, CSS, and JavaScript - no external libraries required

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

## Data Storage

- **Drafts**: Saved in browser localStorage (client-side only)
- **Submitted Forms**: Also saved in localStorage with timestamp
- **Export**: JSON files can be saved to your computer

## Future Enhancements

To integrate with a backend server:
1. Modify the form submission handler in `script.js`
2. Add an API endpoint to receive form data
3. Update the submit button handler to send data via fetch/XMLHttpRequest

## Notes

- All data is stored locally in your browser
- For production use, consider adding server-side storage
- The form can be customized by modifying the CSS and HTML files
- PDF export uses the browser's native print functionality

# NLCAMS
