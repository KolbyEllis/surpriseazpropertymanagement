// Custom Dropdown Functionality for Contact Form
document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.custom-dropdown');
    
    dropdowns.forEach(dropdown => {
        const selected = dropdown.querySelector('.custom-selected');
        const options = dropdown.querySelector('.custom-options');
        const hiddenInput = dropdown.querySelector('input[type="hidden"]');
        const optionItems = dropdown.querySelectorAll('.custom-options li');
        
        // Toggle dropdown on click
        selected.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Close all other dropdowns
            dropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    otherDropdown.classList.remove('active');
                }
            });
            
            // Toggle current dropdown
            dropdown.classList.toggle('active');
        });
        
        // Handle option selection
        optionItems.forEach(option => {
            option.addEventListener('click', function(e) {
                e.stopPropagation();
                
                const value = this.getAttribute('data-value');
                const text = this.textContent;
                
                // Update selected text
                selected.textContent = text;
                
                // Update hidden input value
                hiddenInput.value = value;
                
                // Remove selected class from all options
                optionItems.forEach(item => item.classList.remove('selected'));
                
                // Add selected class to clicked option
                this.classList.add('selected');
                
                // Close dropdown
                dropdown.classList.remove('active');
                
                // Trigger change event for form validation
                hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
            });
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
        
        // Handle keyboard navigation
        dropdown.addEventListener('keydown', function(e) {
            const activeOption = options.querySelector('.selected');
            const allOptions = Array.from(optionItems);
            
            switch(e.key) {
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                    break;
                    
                case 'Escape':
                    dropdown.classList.remove('active');
                    break;
                    
                case 'ArrowDown':
                    e.preventDefault();
                    if (!dropdown.classList.contains('active')) {
                        dropdown.classList.add('active');
                    } else {
                        const currentIndex = activeOption ? allOptions.indexOf(activeOption) : -1;
                        const nextIndex = (currentIndex + 1) % allOptions.length;
                        if (activeOption) activeOption.classList.remove('selected');
                        allOptions[nextIndex].classList.add('selected');
                    }
                    break;
                    
                case 'ArrowUp':
                    e.preventDefault();
                    if (dropdown.classList.contains('active')) {
                        const currentIndex = activeOption ? allOptions.indexOf(activeOption) : allOptions.length;
                        const prevIndex = currentIndex <= 0 ? allOptions.length - 1 : currentIndex - 1;
                        if (activeOption) activeOption.classList.remove('selected');
                        allOptions[prevIndex].classList.add('selected');
                    }
                    break;
            }
        });
    });
});

// Contact form spam phrase blocking
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('cs-form-1403');

    if (!contactForm) {
        return;
    }

    const blockedPhrases = [
        "i currently own several rental units across arizona and am looking for a dependable property manager who can oversee these properties effectively. as i work toward expanding my real estate portfolio, managing everything on my own has become increasingly demanding, and i'm reaching the point where i need dedicated support to ensure everything continues to run smoothly."
    ];

    function normalizeText(text) {
        return text
            .toLowerCase()
            .replace(/\u2018|\u2019/g, "'")
            .replace(/\s+/g, " ")
            .trim();
    }

    function removeSpamError() {
        const existingError = contactForm.querySelector('.cs-spam-error');
        if (existingError) {
            existingError.remove();
        }
    }

    function showSpamError() {
        removeSpamError();
        const error = document.createElement('p');
        error.className = 'cs-spam-error';
        error.textContent = 'Your message could not be submitted. Please reword and try again.';
        error.setAttribute('role', 'alert');
        error.style.color = '#b42318';
        error.style.marginTop = '1rem';
        contactForm.appendChild(error);
    }

    contactForm.addEventListener('submit', function(event) {
        const messageField = contactForm.querySelector('textarea[name="Message"]');
        const messageText = messageField ? normalizeText(messageField.value) : '';
        const isBlocked = blockedPhrases.some(function(phrase) {
            return messageText.includes(phrase);
        });

        if (isBlocked) {
            event.preventDefault();
            showSpamError();
            if (messageField) {
                messageField.focus();
            }
            return;
        }

        removeSpamError();
    });
});
