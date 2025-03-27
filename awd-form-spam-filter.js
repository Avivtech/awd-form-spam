document.querySelectorAll("form[awd-form='spam-filter']").forEach(form => {
  const inputs = form.querySelectorAll("input[type='email'], input[type='tel'], input[type='text'], input[type='number'], textarea");
  const submitBtn = form.querySelector("button[type='submit'], input[type='submit']");

  const updateSubmitState = (isSpam) => {
    if (!submitBtn) return;
    submitBtn.disabled = isSpam;
    submitBtn.classList.toggle("awd-disabled", isSpam);
  };

  const checkSingleInput = (input) => {
    const value = input.value.trim().toLowerCase();
    const name = input.name || input.className || input.type;
    let isSpam = false;

    console.log(`Checking input [${name}]: "${value}"`);

    // Email domain check
    if (input.type === "email" && input.hasAttribute("awd-form-domains")) {
      const baseDomains = input.getAttribute("awd-form-domains").toLowerCase().split(",").map(d => d.trim());
      console.log(`→ Testing email against domains:`, baseDomains);
      const emailDomain = value.split("@")[1];
      if (emailDomain) {
        const matched = baseDomains.find(base => emailDomain.startsWith(base + ".") || emailDomain === base);
        if (matched) {
          console.log(`🚫 SPAM detected in [${name}]: matched domain "${matched}" in "${emailDomain}"`);
          isSpam = true;
        }
      }
    }

    // Phone code check
    if (input.type === "tel" && input.hasAttribute("awd-form-phone")) {
      const codes = input.getAttribute("awd-form-phone").split(",").map(c => c.trim());
      console.log(`→ Testing phone against codes:`, codes);
      const matchedCode = codes.find(code => value.startsWith(code));
      if (matchedCode) {
        console.log(`🚫 SPAM detected in [${name}]: phone starts with blocked code "${matchedCode}"`);
        isSpam = true;
      }
    }

    // Text/textarea keyword and min-length check
    const isTextLike = input.type === "text" || input.tagName.toLowerCase() === "textarea";
    if (isTextLike) {
      if (input.hasAttribute("awd-form-txt")) {
        const words = input.getAttribute("awd-form-txt").toLowerCase().split(",").map(w => w.trim());
        console.log(`→ Testing text against blocked words:`, words);
        const matchedWord = words.find(word => value.includes(word));
        if (matchedWord) {
          console.log(`🚫 SPAM detected in [${name}]: contains blocked word "${matchedWord}"`);
          isSpam = true;
        }
      }

      if (input.hasAttribute("awd-form-txt-min")) {
        const minLength = parseInt(input.getAttribute("awd-form-txt-min"), 10);
        if (value.length < minLength) {
          console.log(`🚫 SPAM detected in [${name}]: text is shorter than minimum length (${minLength})`);
          isSpam = true;
        }
      }
    }

    return isSpam;
  };

  const checkForm = () => {
    let isSpam = false;
    inputs.forEach(input => {
      if (checkSingleInput(input)) isSpam = true;
    });
    updateSubmitState(isSpam);
    return isSpam;
  };

  inputs.forEach(input => {
    ["input", "focus", "blur"].forEach(evt => {
      input.addEventListener(evt, () => {
        const spam = checkSingleInput(input);
        updateSubmitState(spam || checkForm());
      });
    });
  });

  form.addEventListener("submit", e => {
    if (checkForm()) {
      e.preventDefault();
      console.log("🚫 Form submission blocked due to SPAM");
    }
  });

  checkForm();
});
