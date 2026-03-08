// ---- Registration Form Handler ----
document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('registrationForm');
    if (!form) return;

    var GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSevkVYMDVvRA7Wp5dpV1JGoyoRjPzLPxYaEgPsKETU49t8opw/formResponse';

    var sourceSelect = document.getElementById('source');
    var otherGroup = document.getElementById('otherSourceGroup');
    var otherInput = document.getElementById('otherSource');
    var submitBtn = document.getElementById('submitBtn');
    var btnText = submitBtn.querySelector('.btn-text');
    var btnLoading = submitBtn.querySelector('.btn-loading');
    var successDiv = document.getElementById('formSuccess');
    var errorDiv = document.getElementById('formError');
    var tryAgainBtn = document.getElementById('tryAgainBtn');
    var termsCheckbox = document.getElementById('terms');
    var termsModal = document.getElementById('termsModal');

    // Show/hide "Other" text field
    sourceSelect.addEventListener('change', function () {
        if (sourceSelect.value === '__other_option__') {
            otherGroup.style.display = 'block';
            otherInput.setAttribute('required', '');
        } else {
            otherGroup.style.display = 'none';
            otherInput.removeAttribute('required');
            otherInput.value = '';
        }
    });

    // Try Again button
    tryAgainBtn.addEventListener('click', function () {
        errorDiv.style.display = 'none';
        form.style.display = 'block';
    });

    // Clear validation styling on input
    form.querySelectorAll('input, select').forEach(function (field) {
        field.addEventListener('input', function () {
            field.classList.remove('invalid');
            var fg = field.closest('.form-group');
            if (fg) fg.classList.remove('has-error');
        });
        field.addEventListener('change', function () {
            field.classList.remove('invalid');
            var fg = field.closest('.form-group');
            if (fg) fg.classList.remove('has-error');
        });
    });

    // ---- Terms & Conditions Modal ----
    function openModal() {
        termsModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    function closeModal() {
        termsModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    document.getElementById('openTerms').addEventListener('click', function (e) {
        e.preventDefault();
        openModal();
    });
    document.getElementById('closeTerms').addEventListener('click', closeModal);
    document.getElementById('acceptTerms').addEventListener('click', function () {
        termsCheckbox.checked = true;
        var fg = termsCheckbox.closest('.form-group');
        if (fg) fg.classList.remove('has-error');
        closeModal();
    });
    termsModal.addEventListener('click', function (e) {
        if (e.target === termsModal) closeModal();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && termsModal.classList.contains('active')) closeModal();
    });

    // ---- Form submit: validate, then POST via fetch ----
    form.addEventListener('submit', function (e) {
        e.preventDefault(); // Always prevent native submit

        var isValid = true;

        // Check all required fields
        var requiredFields = form.querySelectorAll('[required]');
        for (var i = 0; i < requiredFields.length; i++) {
            var field = requiredFields[i];
            var fg = field.closest('.form-group');

            if (field.type === 'checkbox' && !field.checked) {
                if (fg) fg.classList.add('has-error');
                isValid = false;
            } else if (field.type !== 'checkbox' && (!field.value || !field.value.trim())) {
                field.classList.add('invalid');
                if (fg) fg.classList.add('has-error');
                isValid = false;
            }
        }

        // Email format check
        var emailField = document.getElementById('email');
        if (emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
            emailField.classList.add('invalid');
            var efg = emailField.closest('.form-group');
            if (efg) efg.classList.add('has-error');
            isValid = false;
        }

        if (!isValid) {
            var firstErr = form.querySelector('.has-error');
            if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        // Build URL-encoded form data
        var params = new URLSearchParams();
        params.append('entry.554657075', document.getElementById('studentName').value.trim());
        params.append('entry.1460530204', emailField.value.trim());
        params.append('entry.283671736', document.getElementById('mobile').value.trim());
        params.append('entry.100367529', document.getElementById('experience').value);
        params.append('entry.209048306', sourceSelect.value);
        if (sourceSelect.value === '__other_option__' && otherInput.value.trim()) {
            params.append('entry.209048306.other_option_response', otherInput.value.trim());
        }
        params.append('entry.1216055466', 'I Agree');

        // Show loading state
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-flex';
        submitBtn.disabled = true;

        // Submit via fetch (no-cors) AND hidden iframe as backup
        var fetchDone = false;

        // Method 1: fetch with no-cors
        fetch(GOOGLE_FORM_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString()
        }).then(function () {
            fetchDone = true;
            showSuccess();
        }).catch(function () {
            // fetch failed, try iframe backup
            if (!fetchDone) submitViaIframe(params);
        });

        // Method 2: backup via hidden iframe (if fetch fails after 4s)
        setTimeout(function () {
            if (!fetchDone) submitViaIframe(params);
        }, 4000);
    });

    function submitViaIframe(params) {
        // Create a temporary form and submit to iframe
        var iframe = document.getElementById('hiddenIframe');
        var tempForm = document.createElement('form');
        tempForm.method = 'POST';
        tempForm.action = GOOGLE_FORM_URL;
        tempForm.target = 'hidden_iframe';
        tempForm.style.display = 'none';

        // Add all params as hidden inputs
        params.forEach(function (value, key) {
            var input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = value;
            tempForm.appendChild(input);
        });

        document.body.appendChild(tempForm);
        tempForm.submit();
        document.body.removeChild(tempForm);

        // Show success after short delay
        setTimeout(showSuccess, 2000);
    }

    function showSuccess() {
        form.style.display = 'none';
        successDiv.style.display = 'block';
        successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;
    }
});
