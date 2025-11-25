// Form handling and validation
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('assessmentForm');
    const saveDraftBtn = document.getElementById('saveDraft');
    const exportPDFBtn = document.getElementById('exportPDF');
    const successMessage = document.getElementById('successMessage');

    // Auto-set assessment date and verification date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('assessmentDate').value = today;
    document.getElementById('verificationDate').value = today;

    // Enable/disable dependent fields
    setupDependentFields();

    // Load draft if exists
    loadDraft();

    // Save draft functionality
    saveDraftBtn.addEventListener('click', function() {
        const formData = collectFormData();
        localStorage.setItem('assessmentDraft', JSON.stringify(formData));
        showTemporaryMessage('Draft saved successfully!', 'info');
    });

    // Export as PDF
    exportPDFBtn.addEventListener('click', function() {
        window.print();
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            const formDataObj = new FormData(this);
            const data = {};
            
            // Process regular fields
            for (let [key, value] of formDataObj.entries()) {
                if (data[key]) {
                    if (Array.isArray(data[key])) {
                        data[key].push(value);
                    } else {
                        data[key] = [data[key], value];
                    }
                } else {
                    data[key] = value;
                }
            }
            
            // Process checkboxes
            const checkboxGroups = ['disasterType', 'infrastructure', 'priorityNeeds', 'healthRisks', 'envHazards', 'authorities', 'capacities'];
            checkboxGroups.forEach(group => {
                const checked = [];
                document.querySelectorAll(`input[name="${group}"]:checked`).forEach(cb => {
                    checked.push(cb.value);
                });
                if (checked.length > 0) {
                    data[group] = checked;
                }
            });
            
            // Save to localStorage as submitted
            localStorage.setItem('assessmentSubmitted_' + Date.now(), JSON.stringify(data));
            
            // Clear draft
            localStorage.removeItem('assessmentDraft');
            
            // Show success message
            successMessage.style.display = 'block';
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Generate and download PDF
            generatePDF();
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 5000);
            
            console.log('Assessment Form Data:', data);
        }
    });

    // Setup dependent fields (enable/disable based on checkbox/radio state)
    function setupDependentFields() {
        // No dependent fields needed in the new structure
        // All fields are independent now
    }

    // Collect all form data
    function collectFormData() {
        const formData = {
            timestamp: new Date().toISOString(),
            basicInfo: {
                assessmentDate: document.getElementById('assessmentDate').value,
                assessorName: document.getElementById('assessorName').value,
                provinceDistrict: document.getElementById('provinceDistrict').value,
                locationCommunity: document.getElementById('locationCommunity').value,
                gpsCoordinates: document.getElementById('gpsCoordinates').value,
                assessmentType: document.querySelector('input[name="assessmentType"]:checked')?.value
            },
            disasterDetails: {
                disasterType: Array.from(document.querySelectorAll('input[name="disasterType"]:checked')).map(cb => cb.value),
                disasterOther: document.getElementById('disasterOther').value,
                occurrenceDateTime: document.getElementById('occurrenceDateTime').value,
                incidentDescription: document.getElementById('incidentDescription').value
            },
            populationAffected: {
                householdsAffected: document.querySelector('input[name="householdsAffected"]').value || 0,
                individualsAffected: document.querySelector('input[name="individualsAffected"]').value || 0,
                childrenAffected: document.querySelector('input[name="childrenAffected"]').value || 0,
                elderlyAffected: document.querySelector('input[name="elderlyAffected"]').value || 0,
                disabledAffected: document.querySelector('input[name="disabledAffected"]').value || 0,
                pregnantLactatingAffected: document.querySelector('input[name="pregnantLactatingAffected"]').value || 0,
                injured: document.getElementById('injured').value || 0,
                fatalities: document.getElementById('fatalities').value || 0,
                missing: document.getElementById('missing').value || 0
            },
            damageAssessment: {
                totallyDestroyed: document.getElementById('totallyDestroyed').value || 0,
                partiallyDamaged: document.getElementById('partiallyDamaged').value || 0,
                infrastructure: Array.from(document.querySelectorAll('input[name="infrastructure"]:checked')).map(cb => cb.value),
                infrastructureDetails: document.getElementById('infrastructureDetails').value,
                livelihoodImpact: document.getElementById('livelihoodImpact').value
            },
            immediateNeeds: {
                priorityNeeds: Array.from(document.querySelectorAll('input[name="priorityNeeds"]:checked')).map(cb => cb.value),
                needsOther: document.getElementById('needsOther').value,
                needsUrgency: document.getElementById('needsUrgency').value
            },
            healthSafety: {
                healthRisks: Array.from(document.querySelectorAll('input[name="healthRisks"]:checked')).map(cb => cb.value),
                healthDetails: document.getElementById('healthDetails').value,
                envHazards: Array.from(document.querySelectorAll('input[name="envHazards"]:checked')).map(cb => cb.value),
                hazardDetails: document.getElementById('hazardDetails').value
            },
            communityResources: {
                authorities: Array.from(document.querySelectorAll('input[name="authorities"]:checked')).map(cb => cb.value),
                authOther: document.getElementById('authOther').value,
                capacities: Array.from(document.querySelectorAll('input[name="capacities"]:checked')).map(cb => cb.value),
                capacityDetails: document.getElementById('capacityDetails').value
            },
            responsePlan: {
                immediateRecommendations: document.getElementById('immediateRecommendations').value,
                shortTermRecommendations: document.getElementById('shortTermRecommendations').value,
                additionalComments: document.getElementById('additionalComments').value
            },
            verification: {
                assessorSignatureName: document.getElementById('assessorSignatureName').value,
                verificationDate: document.getElementById('verificationDate').value,
                supervisorName: document.getElementById('supervisorName').value,
                supervisorDate: document.getElementById('supervisorDate').value
            }
        };

        return formData;
    }

    // Load draft from localStorage
    function loadDraft() {
        const draft = localStorage.getItem('assessmentDraft');
        if (draft) {
            try {
                const formData = JSON.parse(draft);
                populateForm(formData);
                showTemporaryMessage('Draft loaded. Please review and continue.', 'info');
            } catch (e) {
                console.error('Error loading draft:', e);
            }
        }
    }

    // Populate form with data
    function populateForm(data) {
        if (data.basicInfo) {
            if (data.basicInfo.assessmentDate) document.getElementById('assessmentDate').value = data.basicInfo.assessmentDate;
            if (data.basicInfo.assessorName) document.getElementById('assessorName').value = data.basicInfo.assessorName;
            if (data.basicInfo.provinceDistrict) document.getElementById('provinceDistrict').value = data.basicInfo.provinceDistrict;
            if (data.basicInfo.locationCommunity) document.getElementById('locationCommunity').value = data.basicInfo.locationCommunity;
            if (data.basicInfo.gpsCoordinates) document.getElementById('gpsCoordinates').value = data.basicInfo.gpsCoordinates;
            if (data.basicInfo.assessmentType) {
                const radio = document.querySelector(`input[name="assessmentType"][value="${data.basicInfo.assessmentType}"]`);
                if (radio) radio.checked = true;
            }
        }

        if (data.disasterDetails) {
            if (data.disasterDetails.disasterType && Array.isArray(data.disasterDetails.disasterType)) {
                data.disasterDetails.disasterType.forEach(value => {
                    const checkbox = document.querySelector(`input[name="disasterType"][value="${value}"]`);
                    if (checkbox) checkbox.checked = true;
                });
            }
            if (data.disasterDetails.disasterOther) document.getElementById('disasterOther').value = data.disasterDetails.disasterOther;
            if (data.disasterDetails.occurrenceDateTime) document.getElementById('occurrenceDateTime').value = data.disasterDetails.occurrenceDateTime;
            if (data.disasterDetails.incidentDescription) document.getElementById('incidentDescription').value = data.disasterDetails.incidentDescription;
        }

        if (data.populationAffected) {
            if (data.populationAffected.householdsAffected) document.querySelector('input[name="householdsAffected"]').value = data.populationAffected.householdsAffected;
            if (data.populationAffected.individualsAffected) document.querySelector('input[name="individualsAffected"]').value = data.populationAffected.individualsAffected;
            if (data.populationAffected.childrenAffected) document.querySelector('input[name="childrenAffected"]').value = data.populationAffected.childrenAffected;
            if (data.populationAffected.elderlyAffected) document.querySelector('input[name="elderlyAffected"]').value = data.populationAffected.elderlyAffected;
            if (data.populationAffected.disabledAffected) document.querySelector('input[name="disabledAffected"]').value = data.populationAffected.disabledAffected;
            if (data.populationAffected.pregnantLactatingAffected) document.querySelector('input[name="pregnantLactatingAffected"]').value = data.populationAffected.pregnantLactatingAffected;
            if (data.populationAffected.injured) document.getElementById('injured').value = data.populationAffected.injured;
            if (data.populationAffected.fatalities) document.getElementById('fatalities').value = data.populationAffected.fatalities;
            if (data.populationAffected.missing) document.getElementById('missing').value = data.populationAffected.missing;
        }

        if (data.damageAssessment) {
            if (data.damageAssessment.totallyDestroyed) document.getElementById('totallyDestroyed').value = data.damageAssessment.totallyDestroyed;
            if (data.damageAssessment.partiallyDamaged) document.getElementById('partiallyDamaged').value = data.damageAssessment.partiallyDamaged;
            if (data.damageAssessment.infrastructure && Array.isArray(data.damageAssessment.infrastructure)) {
                data.damageAssessment.infrastructure.forEach(value => {
                    const checkbox = document.querySelector(`input[name="infrastructure"][value="${value}"]`);
                    if (checkbox) checkbox.checked = true;
                });
            }
            if (data.damageAssessment.infrastructureDetails) document.getElementById('infrastructureDetails').value = data.damageAssessment.infrastructureDetails;
            if (data.damageAssessment.livelihoodImpact) document.getElementById('livelihoodImpact').value = data.damageAssessment.livelihoodImpact;
        }

        if (data.immediateNeeds) {
            if (data.immediateNeeds.priorityNeeds && Array.isArray(data.immediateNeeds.priorityNeeds)) {
                data.immediateNeeds.priorityNeeds.forEach(value => {
                    const checkbox = document.querySelector(`input[name="priorityNeeds"][value="${value}"]`);
                    if (checkbox) checkbox.checked = true;
                });
            }
            if (data.immediateNeeds.needsOther) document.getElementById('needsOther').value = data.immediateNeeds.needsOther;
            if (data.immediateNeeds.needsUrgency) document.getElementById('needsUrgency').value = data.immediateNeeds.needsUrgency;
        }

        if (data.healthSafety) {
            if (data.healthSafety.healthRisks && Array.isArray(data.healthSafety.healthRisks)) {
                data.healthSafety.healthRisks.forEach(value => {
                    const checkbox = document.querySelector(`input[name="healthRisks"][value="${value}"]`);
                    if (checkbox) checkbox.checked = true;
                });
            }
            if (data.healthSafety.healthDetails) document.getElementById('healthDetails').value = data.healthSafety.healthDetails;
            if (data.healthSafety.envHazards && Array.isArray(data.healthSafety.envHazards)) {
                data.healthSafety.envHazards.forEach(value => {
                    const checkbox = document.querySelector(`input[name="envHazards"][value="${value}"]`);
                    if (checkbox) checkbox.checked = true;
                });
            }
            if (data.healthSafety.hazardDetails) document.getElementById('hazardDetails').value = data.healthSafety.hazardDetails;
        }

        if (data.communityResources) {
            if (data.communityResources.authorities && Array.isArray(data.communityResources.authorities)) {
                data.communityResources.authorities.forEach(value => {
                    const checkbox = document.querySelector(`input[name="authorities"][value="${value}"]`);
                    if (checkbox) checkbox.checked = true;
                });
            }
            if (data.communityResources.authOther) document.getElementById('authOther').value = data.communityResources.authOther;
            if (data.communityResources.capacities && Array.isArray(data.communityResources.capacities)) {
                data.communityResources.capacities.forEach(value => {
                    const checkbox = document.querySelector(`input[name="capacities"][value="${value}"]`);
                    if (checkbox) checkbox.checked = true;
                });
            }
            if (data.communityResources.capacityDetails) document.getElementById('capacityDetails').value = data.communityResources.capacityDetails;
        }

        if (data.responsePlan) {
            if (data.responsePlan.immediateRecommendations) document.getElementById('immediateRecommendations').value = data.responsePlan.immediateRecommendations;
            if (data.responsePlan.shortTermRecommendations) document.getElementById('shortTermRecommendations').value = data.responsePlan.shortTermRecommendations;
            if (data.responsePlan.additionalComments) document.getElementById('additionalComments').value = data.responsePlan.additionalComments;
        }

        if (data.verification) {
            if (data.verification.assessorSignatureName) document.getElementById('assessorSignatureName').value = data.verification.assessorSignatureName;
            if (data.verification.verificationDate) document.getElementById('verificationDate').value = data.verification.verificationDate;
            if (data.verification.supervisorName) document.getElementById('supervisorName').value = data.verification.supervisorName;
            if (data.verification.supervisorDate) document.getElementById('supervisorDate').value = data.verification.supervisorDate;
        }
    }

    // Validate form
    function validateForm() {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim() && field.offsetParent !== null) {
                isValid = false;
                field.style.borderColor = '#dc2626';
                field.addEventListener('input', function() {
                    this.style.borderColor = '#ddd';
                }, { once: true });
            }
        });

        if (!isValid) {
            showTemporaryMessage('Please fill in all required fields.', 'error');
            // Scroll to first error
            const firstError = form.querySelector('[required]:invalid');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
        }

        return isValid;
    }

    // Show temporary message
    function showTemporaryMessage(message, type) {
        // Create or update message element
        let messageEl = document.getElementById('tempMessage');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'tempMessage';
            messageEl.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 6px;
                color: white;
                font-weight: 600;
                z-index: 10000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                animation: slideIn 0.3s ease;
            `;
            document.body.appendChild(messageEl);
        }

        const colors = {
            success: '#28a745',
            error: '#dc3545',
            info: '#17a2b8'
        };

        messageEl.style.backgroundColor = colors[type] || colors.info;
        messageEl.textContent = message;

        setTimeout(() => {
            messageEl.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 300);
        }, 3000);
    }

    // Generate PDF function
    function generatePDF() {
        // Hide buttons and success message for PDF
        const submitSection = document.querySelector('.submit-section');
        const successMsg = document.getElementById('successMessage');
        const originalSubmitDisplay = submitSection ? submitSection.style.display : '';
        const originalSuccessDisplay = successMsg ? successMsg.style.display : '';
        
        if (submitSection) submitSection.style.display = 'none';
        if (successMsg) successMsg.style.display = 'none';
        
        // Add PDF mode class to body
        document.body.classList.add('pdf-mode');
        
        // Wait a moment for DOM to update
        setTimeout(() => {
            // Get the form container
            const element = document.querySelector('.container');
            if (!element) {
                console.error('Container element not found');
                restoreUI();
                return;
            }
            
            const assessmentDate = document.getElementById('assessmentDate')?.value || new Date().toISOString().split('T')[0];
            
            // Scroll to top to ensure proper rendering
            window.scrollTo(0, 0);
            
            // Wait a moment for scroll to complete
            setTimeout(() => {
                // Configure PDF options - simplified to prevent empty pages
                const opt = {
                    margin: [10, 10, 10, 10],
                    filename: `disaster_assessment_${assessmentDate}.pdf`,
                    image: { type: 'jpeg', quality: 0.95 },
                    html2canvas: { 
                        scale: 1.5,
                        useCORS: true,
                        logging: false,
                        letterRendering: true,
                        allowTaint: true,
                        backgroundColor: '#ffffff',
                        scrollX: 0,
                        scrollY: 0
                    },
                    jsPDF: { 
                        unit: 'mm', 
                        format: 'a4', 
                        orientation: 'portrait',
                        compress: true
                    },
                    pagebreak: { 
                        mode: ['avoid-all', 'css'],
                        avoid: ['.section']
                    }
                };
                
                // Generate PDF with better error handling
                html2pdf()
                    .set(opt)
                    .from(element)
                    .toPdf()
                    .get('pdf')
                    .then(function(pdf) {
                        // Save the PDF
                        pdf.save(`disaster_assessment_${assessmentDate}.pdf`);
                        restoreUI();
                        showTemporaryMessage('PDF downloaded successfully!', 'success');
                    })
                    .catch((error) => {
                        console.error('PDF generation error:', error);
                        // Fallback to direct save method
                        html2pdf().set(opt).from(element).save().then(() => {
                            restoreUI();
                            showTemporaryMessage('PDF downloaded successfully!', 'success');
                        }).catch((err) => {
                            console.error('Fallback PDF generation error:', err);
                            restoreUI();
                            // Final fallback to print dialog
                            if (confirm('PDF generation failed. Would you like to use the print dialog instead?')) {
                                window.print();
                            } else {
                                showTemporaryMessage('Error generating PDF. Please try again.', 'error');
                            }
                        });
                    });
            }, 100);
            
            function restoreUI() {
                if (submitSection) submitSection.style.display = originalSubmitDisplay || '';
                if (successMsg) successMsg.style.display = originalSuccessDisplay;
                document.body.classList.remove('pdf-mode');
            }
        }, 300);
    }

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});

