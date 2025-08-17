// Patient Timeline JavaScript - Based on 8-Month Chat Logs

// Patient data extracted from all three chat logs
const chatBasedPatients = [
    {
        id: 1,
        name: 'John Doe',
        age: 34,
        email: 'member@example.com',
        profession: 'Software Developer',
        doctor: 'Dr. Jane Smith',
        events: [
            {
                date: '2024-01-08',
                title: 'Initial Consultation',
                content: 'Patient reported persistent headaches and fatigue. Blood pressure elevated at 135/85, cholesterol 210 mg/dL, vitamin D low at 18 ng/mL.',
                medications: ['Atorvastatin 20mg - Daily for cholesterol', 'Vitamin D3 2000 IU - Daily'],
                conversation: 'Patient: "I\'ve been having these headaches for the past week, and I feel tired all the time."\n\nDoctor: "I understand. Let\'s check your blood pressure and run some tests. Can you tell me more about when these headaches occur?"\n\nPatient: "They usually start in the afternoon and get worse by evening. I also feel very tired throughout the day."\n\nDoctor: "Based on your symptoms and the elevated blood pressure, I\'m prescribing Atorvastatin for cholesterol and Vitamin D3. We\'ll monitor your progress closely."'
            },
            {
                date: '2024-01-10',
                title: 'Medication Adjustment',
                content: 'Patient reported mild nausea with statin. Recommended taking with dinner instead of empty stomach.',
                medications: ['Atorvastatin 20mg - Daily with dinner', 'Vitamin D3 2000 IU - Daily'],
                conversation: 'Patient: "Is it normal to feel slightly nauseous after taking the statin?"\n\nDoctor: "Yes, that\'s a common side effect. Try taking it with dinner instead of on an empty stomach. This should help reduce the nausea."\n\nPatient: "Thank you, I\'ll try that. Should I be concerned about any other side effects?"\n\nDoctor: "Monitor for muscle pain or weakness. If you experience any severe symptoms, contact me immediately. Otherwise, continue with the current dosage."'
            },
            {
                date: '2024-01-12',
                title: 'BP Monitoring Results',
                content: 'Blood pressure readings improving: Mon 132/82, Wed 130/84, Fri 128/80. Headaches less frequent.',
                medications: ['Atorvastatin 20mg - Daily with dinner', 'Vitamin D3 2000 IU - Daily'],
                conversation: 'Patient: "BP readings this week: Mon 132/82, Wed 130/84, today 128/80. Headaches are less frequent!"\n\nDoctor: "Excellent progress! Your blood pressure is trending downward. The headaches improving is a good sign that the medication is working."\n\nPatient: "Yes, I feel much better overall. Should I continue monitoring my BP daily?"\n\nDoctor: "Yes, keep monitoring. The trend is very positive. We\'ll review again in two weeks."'
            },
            {
                date: '2024-01-22',
                title: 'Follow-up Progress',
                content: 'BP readings: Fri 125/78, Sun 127/81, Mon 124/76. Feeling much better overall.',
                medications: ['Atorvastatin 20mg - Daily with dinner', 'Vitamin D3 2000 IU - Daily'],
                conversation: 'Patient: "BP readings: Fri 125/78, Sun 127/81, today 124/76. Feeling much better overall!"\n\nDoctor: "This is fantastic progress! Your blood pressure is now in the normal range. How are the headaches?"\n\nPatient: "Almost completely gone. I only get a mild one occasionally."\n\nDoctor: "Perfect! The medication and lifestyle changes are working well. Keep up the good work."'
            },
            {
                date: '2024-01-24',
                title: 'Post-Checkup Assessment',
                content: 'BP in office: 122/75 - significant improvement. Weight down 3 lbs. Continuing current regimen.',
                medications: ['Atorvastatin 20mg - Daily with dinner', 'Vitamin D3 2000 IU - Daily'],
                conversation: 'Doctor: "Great visit today John! Your BP in office was 122/75 - significant improvement."\n\nPatient: "Thank you! I\'ve been feeling so much better. The weight loss has been a nice bonus too."\n\nDoctor: "Absolutely! The 3-pound weight loss is excellent. Your cholesterol levels are also improving. Continue with the current regimen."\n\nPatient: "Should I schedule my next follow-up?"\n\nDoctor: "Yes, let\'s see you in 6 weeks to monitor your continued progress."'
            },
            {
                date: '2024-02-05',
                title: 'Stress Management Discussion',
                content: 'BP spiked due to work stress: Sat 138/86, Sun 135/83. Back to normal at 123/77. Discussed sleep hygiene and stress management.',
                medications: ['Atorvastatin 20mg - Daily with dinner', 'Vitamin D3 2000 IU - Daily'],
                conversation: 'Patient: "Had a stressful weekend with a work deadline. BP spiked: Sat 138/86, Sun 135/83."\n\nDoctor: "Stress can definitely affect blood pressure. How are you feeling now?"\n\nPatient: "Better today, BP is back to 123/77. But I\'m worried about stress management."\n\nDoctor: "Let\'s discuss some stress management techniques. Try deep breathing exercises and ensure you\'re getting adequate sleep. Stress is manageable."\n\nPatient: "Thank you, I\'ll work on that."'
            },
            {
                date: '2024-02-08',
                title: 'Sleep Improvement',
                content: 'Sleep improved with hygiene tips: 7.5 hours last night. BP: 121/76.',
                medications: ['Atorvastatin 20mg - Daily with dinner', 'Vitamin D3 2000 IU - Daily'],
                conversation: 'Patient: "Tried the sleep hygiene tips. Slept 7.5 hours last night! Feeling much better."\n\nDoctor: "That\'s excellent! Sleep is crucial for blood pressure control. How\'s your BP today?"\n\nPatient: "121/76 - much better than before!"\n\nDoctor: "Perfect! The sleep hygiene is working. Continue with these practices. Good sleep quality is essential for your overall health."\n\nPatient: "I will, thank you for the advice."'
            },
            {
                date: '2024-02-21',
                title: 'Medication Reduction',
                content: 'BP 118/74, weight down another 4 lbs. Cholesterol dropped to 185 mg/dL. Reducing Atorvastatin to 10mg daily.',
                medications: ['Atorvastatin 10mg - Daily with dinner', 'Vitamin D3 2000 IU - Daily'],
                conversation: 'Doctor: "Excellent visit today! BP 118/74, cholesterol dropped to 185 mg/dL. I\'m reducing your Atorvastatin to 10mg daily."\n\nPatient: "That\'s great news! Does this mean I\'m getting better?"\n\nDoctor: "Absolutely! Your numbers are excellent. The weight loss and lifestyle changes are working. We can reduce the medication dose."\n\nPatient: "Should I continue with the same diet and exercise routine?"\n\nDoctor: "Yes, maintain your current healthy habits. The combination of medication and lifestyle is working perfectly."'
            },
            {
                date: '2024-03-15',
                title: 'Panic Attack Episode',
                content: 'Patient experienced panic attack: heart racing, sweating, difficulty breathing for 10 minutes. No obvious triggers.',
                medications: ['Atorvastatin 10mg - Daily with dinner', 'Vitamin D3 2000 IU - Daily'],
                conversation: 'Patient: "I had what felt like a panic attack last night. Heart racing, sweating, couldn\'t breathe properly."\n\nDoctor: "This sounds like a panic attack. How long did it last?"\n\nPatient: "About 10 minutes. It was terrifying. I thought I was having a heart attack."\n\nDoctor: "Panic attacks can feel very scary. Let\'s schedule an EKG to rule out any heart issues, but this is likely anxiety-related."\n\nPatient: "Should I be worried? This has never happened before."\n\nDoctor: "Don\'t worry, we\'ll get this sorted out. Panic attacks are treatable."'
            },
            {
                date: '2024-03-18',
                title: 'Anxiety Management',
                content: 'Diagnosed anxiety-related panic attacks. EKG normal. Prescribing Lorazepam 0.5mg as needed and Sertraline 25mg daily.',
                medications: ['Atorvastatin 10mg - Daily with dinner', 'Vitamin D3 2000 IU - Daily', 'Lorazepam 0.5mg - As needed for severe episodes', 'Sertraline 25mg - Daily'],
                conversation: 'Doctor: "After today\'s evaluation, your heart and lungs are completely normal. This appears to be anxiety-related panic attacks."\n\nPatient: "So it\'s not my heart? That\'s a relief."\n\nDoctor: "Your heart is perfectly healthy. The EKG was normal. I\'m prescribing Lorazepam for severe episodes and Sertraline daily to prevent future attacks."\n\nPatient: "Will these medications help?"\n\nDoctor: "Yes, Sertraline will help prevent panic attacks, and Lorazepam is for emergency use during severe episodes. We\'ll start with a low dose."\n\nPatient: "Thank you, doctor. I feel much better knowing it\'s treatable."'
            },
            {
                date: '2024-04-10',
                title: 'Anxiety Improvement',
                content: '3 weeks on Sertraline. Anxiety much better, only needed Lorazepam once. BP: 117/73. Mild morning nausea resolved.',
                medications: ['Atorvastatin 10mg - Daily with dinner', 'Vitamin D3 2000 IU - Daily', 'Sertraline 25mg - Daily with breakfast'],
                conversation: 'Patient: "It\'s been 3 weeks on Sertraline. Anxiety much better! Only needed Lorazepam once."\n\nDoctor: "That\'s excellent progress! How are you feeling overall?"\n\nPatient: "Much calmer. The morning nausea from Sertraline has also resolved. BP is 117/73."\n\nDoctor: "Great! The medication is working well. The nausea typically improves after the first few weeks. Continue with the current dose."\n\nPatient: "Should I still carry the Lorazepam with me?"\n\nDoctor: "Yes, keep it handy just in case, but it sounds like you won\'t need it often."'
            },
            {
                date: '2024-05-07',
                title: 'Medication Discontinuation',
                content: 'BP 116/72, weight stable, cholesterol 165 mg/dL. Discontinuing Atorvastatin - levels excellent with diet/exercise.',
                medications: ['Vitamin D3 2000 IU - Daily', 'Sertraline 25mg - Daily with breakfast'],
                conversation: 'Doctor: "Outstanding visit! BP 116/72, cholesterol now 165 mg/dL. I\'m discontinuing the Atorvastatin."\n\nPatient: "Really? That\'s amazing! Does this mean I\'m cured?"\n\nDoctor: "Your lifestyle changes have been so effective that you no longer need the cholesterol medication. Your diet and exercise are working perfectly."\n\nPatient: "Should I continue with the other medications?"\n\nDoctor: "Yes, continue with Vitamin D3 and Sertraline. The Atorvastatin was only needed for cholesterol, which is now under control naturally."\n\nPatient: "This is such great news! Thank you for helping me get healthy."'
            },
            {
                date: '2024-06-06',
                title: 'Digestive Issues',
                content: 'Stomach upset for 3 days: mild cramping and loose stools. Started new probiotic supplement. Recommended stopping probiotic.',
                medications: ['Vitamin D3 2000 IU - Daily', 'Sertraline 25mg - Daily with breakfast'],
                conversation: 'Patient: "I\'ve been having some stomach upset for the past 3 days. Not severe, just uncomfortable."'
            },
            {
                date: '2024-07-17',
                title: 'Travel Consultation',
                content: 'Patient planning 2-week Europe vacation. Discussed medication timing, travel considerations, and alcohol with Sertraline.',
                medications: ['Vitamin D3 2000 IU - Daily', 'Sertraline 25mg - Daily with breakfast'],
                conversation: 'Patient: "Planning a 2-week vacation to Europe in July. Any travel considerations with my medications?"'
            },
            {
                date: '2024-08-14',
                title: '6-Month Assessment',
                content: 'Exceptional progress: BP 114/71, weight down 12 lbs total, cholesterol 162 mg/dL off statins, anxiety well-controlled. Reducing Sertraline to 12.5mg daily.',
                medications: ['Vitamin D3 2000 IU - Daily', 'Sertraline 12.5mg - Daily with breakfast'],
                conversation: 'Doctor: "Exceptional 6-month progress! BP 114/71, weight down 12 lbs total, anxiety well-controlled."'
            }
        ]
    },
    {
        id: 2,
        name: 'Alice Johnson',
        age: 45,
        email: 'alice@example.com',
        profession: 'Business Manager',
        doctor: 'Dr. Sarah Johnson',
        events: [
            {
                date: '2025-01-03',
                title: 'Initial Assessment',
                content: 'BP 148/92, feeling heavy. Patient missing Amlodipine doses. High blood pressure concerns.',
                medications: ['Amlodipine - Daily for blood pressure'],
                conversation: 'Patient: "Good morning doctor. My BP was 148/92 today. Feeling a bit heavy."'
            },
            {
                date: '2025-01-05',
                title: 'Anxiety Episode',
                content: 'Patient had anxiety attack: sweating, heart racing. Breathing exercises didn\'t help much.',
                medications: ['Amlodipine - Daily', 'Escitalopram 5mg - Daily'],
                conversation: 'Patient: "Had an anxiety attack last night, sweating, heart racing."'
            },
            {
                date: '2025-01-07',
                title: 'Diabetes Diagnosis',
                content: 'Fasting sugar 154, post-breakfast 201. High blood glucose levels detected.',
                medications: ['Amlodipine - Daily', 'Escitalopram 5mg - Daily', 'Metformin - Daily', 'Glimepiride 1mg - Before breakfast'],
                conversation: 'Patient: "Fasting sugar 154, after breakfast 201."'
            },
            {
                date: '2025-01-09',
                title: 'Lab Results Review',
                content: 'HbA1c 7.9, cholesterol borderline high. Added Atorvastatin for cholesterol management.',
                medications: ['Amlodipine - Daily', 'Escitalopram 5mg - Daily', 'Metformin - Daily', 'Glimepiride 1mg - Before breakfast', 'Atorvastatin 10mg - Nightly'],
                conversation: 'Doctor: "Report shows HbA1c 7.9, cholesterol borderline. Add Atorvastatin 10mg nightly."'
            },
            {
                date: '2025-01-15',
                title: 'BP Improvement',
                content: 'BP improved to 132/86. Recommended daily walking and lifestyle modifications.',
                medications: ['Amlodipine - Daily', 'Escitalopram 5mg - Daily', 'Metformin - Daily', 'Glimepiride 1mg - Before breakfast', 'Atorvastatin 10mg - Nightly'],
                conversation: 'Patient: "BP improved today: 132/86."'
            }
        ]
    },
    {
        id: 3,
        name: 'Michael Smith',
        age: 52,
        email: 'michael@example.com',
        profession: 'Teacher',
        doctor: 'Dr. Emily Chen',
        events: [
            {
                date: '2025-01-26',
                title: 'Initial Consultation',
                content: 'Patient reported anxiety, chest tightness for 5 minutes. Sugar 191, BP 141/86. Started Atorvastatin for cholesterol.',
                medications: ['Atorvastatin - Daily for cholesterol management'],
                conversation: 'Patient: "Felt anxious today, chest tightness for 5 minutes. Sugar 191, BP 141/86."'
            },
            {
                date: '2025-01-11',
                title: 'Anxiety Management',
                content: 'Poor sleep (6 hours), anxiety episode at night. Added Escitalopram 5mg for anxiety control.',
                medications: ['Atorvastatin - Daily', 'Escitalopram 5mg - Daily'],
                conversation: 'Patient: "Slept poorly, only 6 hrs. Anxiety episode at night."'
            },
            {
                date: '2025-01-08',
                title: 'Dizziness Assessment',
                content: 'Mild dizziness reported. BP 121/94, sugar 164. Started Atorvastatin for cholesterol management.',
                medications: ['Atorvastatin - Daily for cholesterol management'],
                conversation: 'Patient: "Had mild dizziness. BP 121/94, sugar 164."'
            },
            {
                date: '2025-01-04',
                title: 'Lab Results',
                content: 'ECG/Lab report: HbA1c 7.1, cholesterol 214, creatinine 1.1. Scheduled follow-up labs.',
                medications: ['Atorvastatin - Daily'],
                conversation: 'Patient: "ECG/Lab report done, HbA1c 7.1, cholesterol 214, creatinine 1.1."'
            },
            {
                date: '2025-02-19',
                title: 'Anxiety Episode',
                content: 'Felt anxious, chest tightness for 14 minutes. Sugar 166, BP 123/93. Started Atorvastatin for cholesterol management.',
                medications: ['Atorvastatin - Daily', 'Escitalopram 5mg - Daily'],
                conversation: 'Patient: "Felt anxious today, chest tightness for 14 minutes. Sugar 166, BP 123/93."'
            },
            {
                date: '2025-03-08',
                title: 'Anxiety Episode',
                content: 'Felt anxious, chest tightness for 12 minutes. Sugar 160, BP 139/92. Started Atorvastatin for cholesterol management.',
                medications: ['Atorvastatin - Daily', 'Escitalopram 5mg - Daily'],
                conversation: 'Patient: "Felt anxious today, chest tightness for 12 minutes. Sugar 160, BP 139/92."'
            },
            {
                date: '2025-04-02',
                title: 'Anxiety Episode',
                content: 'Felt anxious, chest tightness for 13 minutes. Sugar 151, BP 128/76. Started Atorvastatin for cholesterol management.',
                medications: ['Atorvastatin - Daily', 'Escitalopram 5mg - Daily'],
                conversation: 'Patient: "Felt anxious today, chest tightness for 13 minutes. Sugar 151, BP 128/76."'
            },
            {
                date: '2025-05-28',
                title: 'Anxiety Episode',
                content: 'Felt anxious, chest tightness for 5 minutes. Sugar 153, BP 135/92. Started Atorvastatin for cholesterol management.',
                medications: ['Atorvastatin - Daily', 'Escitalopram 5mg - Daily'],
                conversation: 'Patient: "Felt anxious today, chest tightness for 5 minutes. Sugar 153, BP 135/92."'
            },
            {
                date: '2025-06-08',
                title: 'Anxiety Episode',
                content: 'Felt anxious, chest tightness for 5 minutes. Sugar 187, BP 139/94. Dizziness likely from BP meds.',
                medications: ['Atorvastatin - Daily', 'Escitalopram 5mg - Daily'],
                conversation: 'Patient: "Felt anxious today, chest tightness for 5 minutes. Sugar 187, BP 139/94."'
            },
            {
                date: '2025-07-02',
                title: 'Anxiety Episode',
                content: 'Felt anxious, chest tightness for 15 minutes. Sugar 193, BP 128/77. Good progress, continue same medications.',
                medications: ['Atorvastatin - Daily', 'Escitalopram 5mg - Daily'],
                conversation: 'Patient: "Felt anxious today, chest tightness for 15 minutes. Sugar 193, BP 128/77."'
            },
            {
                date: '2025-08-10',
                title: 'Anxiety Episode',
                content: 'Felt anxious, chest tightness for 12 minutes. Sugar 136, BP 137/89. Started Atorvastatin for cholesterol management.',
                medications: ['Atorvastatin - Daily', 'Escitalopram 5mg - Daily'],
                conversation: 'Patient: "Felt anxious today, chest tightness for 12 minutes. Sugar 136, BP 137/89."'
            }
        ]
    }
];

let selectedPatient = null;

// Load patient list
function loadPatientList() {
    const patientList = document.getElementById('patientList');
    
    patientList.innerHTML = chatBasedPatients.map(patient => `
        <div class="patient-card" onclick="selectPatient(${patient.id})">
            <div class="patient-info">
                <div class="patient-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="patient-details">
                    <h3>${patient.name}</h3>
                    <p>Age: ${patient.age} | ${patient.profession}</p>
                    <p><small>Doctor: ${patient.doctor}</small></p>
                </div>
            </div>
        </div>
    `).join('');
}

// Select patient and display timeline
function selectPatient(patientId) {
    // Remove previous selection
    document.querySelectorAll('.patient-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selection to clicked card
    event.target.closest('.patient-card').classList.add('selected');
    
    // Find patient data
    const patient = chatBasedPatients.find(p => p.id === patientId);
    
    if (!patient) {
        console.error('Patient not found:', patientId);
        return;
    }
    
    selectedPatient = patient;
    
    // Get dynamic timeline events from localStorage
    const timelineKey = `patient_timeline_${patientId}`;
    const dynamicEvents = JSON.parse(localStorage.getItem(timelineKey) || '[]');
    
    // Merge hardcoded events with dynamic events
    const allEvents = [...patient.events, ...dynamicEvents];
    
    // Sort events by date (newest first)
    allEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Display patient info
    document.getElementById('selectedPatientInfo').innerHTML = `
        <div class="selected-patient-info">
            <h3>${patient.name}</h3>
            <p>Age: ${patient.age} | ${patient.profession} | Doctor: ${patient.doctor}</p>
            <p><strong>8-Month Digital Health Monitoring Timeline</strong></p>
        </div>
    `;
    
    // Show timeline display
    document.getElementById('timelineDisplay').style.display = 'block';
    
    // Load and display timeline
    displayTimeline(patient);
}

// Display timeline for selected patient
function displayTimeline(patient) {
    const timeline = document.getElementById('timeline');
    const currentCondition = document.getElementById('currentCondition');
    
    // Get dynamic timeline events from localStorage
    const timelineKey = `patient_timeline_${patient.id}`;
    const dynamicEvents = JSON.parse(localStorage.getItem(timelineKey) || '[]');
    
    // Merge hardcoded events with dynamic events
    const allEvents = [...patient.events, ...dynamicEvents];
    
    // Sort events by date (earliest first for better flow)
    const sortedEvents = allEvents.sort((a, b) => 
        new Date(a.date) - new Date(b.date)
    );
    
    // Display timeline events in simple chronological list
    timeline.innerHTML = `
        <div class="timeline-summary-header">
            <h3>Patient Timeline</h3>
            <p>Complete chronological health journey</p>
        </div>
        
        <div class="timeline-simple-list">
            ${sortedEvents.map(event => `
                <div class="timeline-event-simple">
                    <div class="event-line-simple">
                        <div class="event-dot-simple"></div>
                        <div class="event-line-connector-simple"></div>
                    </div>
                    <div class="event-content-simple">
                        <div class="event-header-simple">
                            <div class="event-title-simple">${event.title}</div>
                            <div class="event-date-simple">${new Date(event.date).toLocaleDateString()}</div>
                        </div>
                        <div class="event-full-content">
                            <div class="event-description">${event.content}</div>
                            ${event.medications && event.medications.length > 0 ? `
                                <div class="event-medications-simple">
                                    <span class="medication-label-simple">💊 Medications:</span>
                                    ${event.medications.map(med => `
                                        <span class="medication-item-simple">${med}</span>
                                    `).join('')}
                                </div>
                            ` : ''}
                            ${event.conversation ? `
                                <div class="event-conversation-simple">
                                    <span class="conversation-label">💬 Conversation:</span>
                                    <span class="conversation-text" 
                                         data-title="${event.title}" 
                                         data-conversation="${encodeURIComponent(event.conversation)}" 
                                         data-date="${event.date}"
                                         onclick="openConversationModalFromData(this)">${event.conversation}</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    // Display current condition
    displayCurrentCondition(patient, sortedEvents);
}

// Group events by type for better organization
function groupEventsByType(events) {
    const groups = {
        consultation: { title: 'Initial Consultation', events: [], type: 'consultation' },
        medication: { title: 'Medication Changes', events: [], type: 'medication' },
        monitoring: { title: 'Health Monitoring', events: [], type: 'monitoring' },
        progress: { title: 'Treatment Progress', events: [], type: 'progress' },
        assessment: { title: 'Health Assessments', events: [], type: 'assessment' }
    };
    
    events.forEach(event => {
        if (event.title.includes('Initial') || event.title.includes('Consultation')) {
            groups.consultation.events.push(event);
        } else if (event.title.includes('Medication') || event.title.includes('Prescription') || 
                   event.title.includes('Added') || event.title.includes('Discontinuing') ||
                   event.title.includes('Reduction')) {
            groups.medication.events.push(event);
        } else if (event.title.includes('BP') || event.title.includes('Monitoring') || 
                   event.title.includes('Sugar') || event.title.includes('Lab')) {
            groups.monitoring.events.push(event);
        } else if (event.title.includes('Progress') || event.title.includes('Improvement') ||
                   event.title.includes('Assessment')) {
            groups.progress.events.push(event);
        } else {
            groups.assessment.events.push(event);
        }
    });
    
    // Return only groups that have events
    return Object.values(groups).filter(group => group.events.length > 0);
}

// Get icon for group type
function getGroupIcon(type) {
    const icons = {
        consultation: 'fas fa-stethoscope',
        medication: 'fas fa-pills',
        monitoring: 'fas fa-heartbeat',
        progress: 'fas fa-chart-line',
        assessment: 'fas fa-clipboard-check'
    };
    return icons[type] || 'fas fa-circle';
}

// Get concise event summary
function getEventSummary(event) {
    const content = event.content;
    if (content.length > 100) {
        return content.substring(0, 100) + '...';
    }
    return content;
}

// Display current condition
function displayCurrentCondition(patient, events) {
    const currentCondition = document.getElementById('currentCondition');
    
    // Get latest event for assessment
    const latestEvent = events[events.length - 1]; // Get the most recent event
    
    // Get current medications from data manager
    const dataManagerMedications = window.dataManager?.data?.medications?.filter(med => 
        med.patientId === patient.id && med.status === 'active'
    ) || [];
    
    // Get medications from the latest timeline event
    const timelineMedications = latestEvent ? latestEvent.medications || [] : [];
    
    // Combine both sources - prioritize data manager medications if available
    const currentMedications = dataManagerMedications.length > 0 ? dataManagerMedications : timelineMedications;
    
    // Update the current medications display to show the most recent data manager medications
    const latestDataManagerMedications = dataManagerMedications.length > 0 ? dataManagerMedications : [];
    
    // Calculate timeline summary
    const totalEvents = events.length;
    const prescriptionChanges = events.filter(e => 
        e.title.includes('Medication') || 
        e.title.includes('Prescription') || 
        e.title.includes('Added') || 
        e.title.includes('Discontinuing') ||
        e.title.includes('Reduction') ||
        e.title.includes('Management')
    ).length;
    
    currentCondition.innerHTML = `
        <h3><i class="fas fa-heartbeat"></i> Current Condition</h3>
        <div class="current-condition-content">
            <p><strong>Latest Assessment:</strong> ${latestEvent ? latestEvent.content : 'No recent assessments'}</p>
        </div>
        
        <div class="timeline-summary">
            <h4><i class="fas fa-chart-bar"></i> Timeline Summary</h4>
            <ul>
                <li><span>Total Events: ${totalEvents}</span></li>
                <li><span>Prescription Changes: ${prescriptionChanges}</span></li>
                <li><span>Monitoring Period: 8 months</span></li>
            </ul>
        </div>
        
        ${currentMedications.length > 0 ? `
            <div class="current-medications">
                <h4><i class="fas fa-pills"></i> Current Medications</h4>
                <div class="medication-list">
                    ${currentMedications.map(med => {
                        if (typeof med === 'string') {
                            // Handle timeline medication format
                            const [name, details] = med.split(' - ');
                            return `
                                <div class="current-medication-item">
                                    <div class="medication-name">${name}</div>
                                    <div class="medication-details">${details}</div>
                                </div>
                            `;
                        } else {
                            // Handle data manager medication format
                            return `
                                <div class="current-medication-item">
                                    <div class="medication-name">${med.name} ${med.dosage}</div>
                                    <div class="medication-details">${med.frequency} - ${med.instructions}</div>
                                </div>
                            `;
                        }
                    }).join('')}
                </div>
            </div>
        ` : '<p><em>No active medications</em></p>'}
        
        <div class="timeline-highlights">
            <p>This timeline shows the complete 8-month digital health monitoring journey, including all prescription changes, medication adjustments, and health improvements based on real chat conversations between patient and doctor.</p>
        </div>
    `;
}

// Open patient timeline function for external access
function openPatientTimeline() {
    window.open('patient-timeline.html', '_blank');
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Load patient list
    loadPatientList();
    
    // Check for patient parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const patientId = urlParams.get('patient');
    
    if (patientId) {
        // Auto-select patient if specified in URL
        setTimeout(() => {
            selectPatient(parseInt(patientId));
        }, 500);
    }
});

// Conversation Modal Functions
function openConversationModal(title, conversation, date) {
    const modal = document.getElementById('conversationModal');
    const modalTitle = document.getElementById('conversationModalTitle');
    const modalContent = document.getElementById('conversationModalContent');
    
    modalTitle.textContent = `${title} - ${new Date(date).toLocaleDateString()}`;
    modalContent.innerHTML = `
        <div class="conversation-details">
            <p><strong>Event:</strong> ${title}</p>
            <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
            <p><strong>Full Conversation:</strong></p>
            <div class="conversation-text-full">
                ${conversation.replace(/\n\n/g, '<br><br>')}
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

function openConversationModalFromData(element) {
    const title = element.getAttribute('data-title');
    const conversation = decodeURIComponent(element.getAttribute('data-conversation'));
    const date = element.getAttribute('data-date');
    
    openConversationModal(title, conversation, date);
}

function closeConversationModal() {
    const modal = document.getElementById('conversationModal');
    modal.style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('conversationModal');
    if (event.target === modal) {
        closeConversationModal();
    }
}

// Export function for external access
window.openPatientTimeline = openPatientTimeline;

// Back button functionality
function goBack() {
    // Check if we came from doctor dashboard
    if (document.referrer.includes('doctor-dashboard.html')) {
        window.location.href = 'doctor-dashboard.html';
    } else {
        // Default fallback
        window.history.back();
    }
}
