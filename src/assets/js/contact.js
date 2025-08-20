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
