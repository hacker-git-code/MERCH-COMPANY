document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const formSteps = Array.from(document.querySelectorAll('.form-step'));
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    const progressSteps = document.querySelectorAll('.progress-step');
    const progressBar = document.querySelector('.progress-bar');
    
    let currentStep = 0;
    const totalSteps = formSteps.length;

    // Hide all steps except the first one
    formSteps.forEach((step, index) => {
        if (index === 0) {
            step.classList.add('active');
        } else {
            step.classList.add('hidden');
        }
    });

    // Update progress bar
    function updateProgressBar() {
        const progress = (currentStep / (totalSteps - 1)) * 100;
        progressBar.style.width = `${progress}%`;
        
        progressSteps.forEach((step, index) => {
            if (index <= currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    // Go to specific step
    function goToStep(step) {
        formSteps[currentStep].classList.remove('active');
        formSteps[currentStep].classList.add('hidden');
        
        currentStep = step;
        
        formSteps[currentStep].classList.remove('hidden');
        formSteps[currentStep].classList.add('active');
        
        updateProgressBar();
    }

    // Next button click handler
    nextButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const currentInputs = formSteps[currentStep].querySelectorAll('input[required], textarea[required]');
            let isValid = true;
            
            currentInputs.forEach(input => {
                if (!input.value.trim()) {
                    input.classList.add('error');
                    isValid = false;
                } else {
                    input.classList.remove('error');
                }
            });
            
            if (isValid && currentStep < totalSteps - 1) {
                goToStep(currentStep + 1);
            }
        });
    });

    // Previous button click handler
    prevButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentStep > 0) {
                goToStep(currentStep - 1);
            }
        });
    });

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Check if user is logged in
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            // Show login modal if not logged in
            authModal.style.display = 'flex';
            document.getElementById('login-form').classList.remove('hidden');
            document.getElementById('signup-form').classList.add('hidden');
            
            // Scroll to top of modal
            authModal.scrollTo(0, 0);
            
            // Show message
            const loginError = document.getElementById('login-error');
            loginError.textContent = 'Please log in to submit the form.';
            loginError.style.color = '#e74c3c';
            
            return; // Stop form submission
        }
        
        // Get form data
        const formData = new FormData(form);
        const formObject = {};
        
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        
        try {
            // Save form data to Supabase
            const { data, error } = await supabase
                .from('inquiries')
                .insert([
                    { 
                        user_id: user.id,
                        form_data: formObject,
                        status: 'new',
                        created_at: new Date()
                    }
                ]);
                
            if (error) throw error;
            
            // Show success message
            formSteps.forEach(step => step.classList.remove('active', 'hidden'));
            form.innerHTML = `
                <div class="form-success">
                    <h3>Thank you, ${user.email}!</h3>
                    <p>Your inquiry has been submitted successfully. We'll get back to you soon!</p>
                    <button type="button" onclick="location.reload()" class="btn btn-primary">Start New Inquiry</button>
                </div>
            `;
            
            // Send email notification (you'll need to implement this on your server)
            // await sendEmailNotification(user.email, formObject);
            
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('An error occurred while submitting your form. Please try again.');
        }
    });
    
    // Update UI based on authentication state
    function updateAuthUI(isLoggedIn) {
        const authButtons = document.getElementById('auth-buttons');
        const userProfile = document.getElementById('user-profile');
        const userName = document.getElementById('user-name');
        
        if (!authButtons || !userProfile || !userName) return;
        
        if (isLoggedIn) {
            const user = supabase.auth.user();
            if (user) {
                userName.textContent = user.email || 'User';
                authButtons.classList.add('hidden');
                userProfile.classList.remove('hidden');
            }
        } else {
            authButtons.classList.remove('hidden');
            userProfile.classList.add('hidden');
        }
    }
    
    // Handle form steps
    if (formSteps.length > 0) {
        // Hide all steps except the first one
        formSteps.forEach((step, index) => {
            if (index === 0) {
                step.classList.add('active');
            } else {
                step.classList.add('hidden');
            }
        });
        
        // Update progress bar
        function updateProgressBar() {
            if (!progressBar) return;
            
            const progress = (currentStep / (totalSteps - 1)) * 100;
            progressBar.style.width = `${progress}%`;
            
            if (progressSteps) {
                progressSteps.forEach((step, index) => {
                    if (index <= currentStep) {
                        step.classList.add('active');
                    } else {
                        step.classList.remove('active');
                    }
                });
            }
        }
        
        // Go to specific step
        function goToStep(step) {
            if (step < 0 || step >= totalSteps) return;
            
            formSteps[currentStep].classList.remove('active');
            formSteps[currentStep].classList.add('hidden');
            
            currentStep = step;
            
            formSteps[currentStep].classList.remove('hidden');
            formSteps[currentStep].classList.add('active');
            
            updateProgressBar();
        }
        
        // Next button click handler
        if (nextButtons.length > 0) {
            nextButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const currentInputs = formSteps[currentStep].querySelectorAll('input[required], textarea[required]');
                    let isValid = true;
                    
                    currentInputs.forEach(input => {
                        if (!input.value.trim()) {
                            input.classList.add('error');
                            isValid = false;
                        } else {
                            input.classList.remove('error');
                        }
                    });
                    
                    if (isValid && currentStep < totalSteps - 1) {
                        goToStep(currentStep + 1);
                    }
                });
            });
        }
        
        // Previous button click handler
        if (prevButtons.length > 0) {
            prevButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (currentStep > 0) {
                        goToStep(currentStep - 1);
                    }
                });
            });
        }
    }
});
