document.querySelectorAll("form[awd-form='spam-filter']").forEach(form => {
  const inputs = form.querySelectorAll("input[type='email'], input[type='tel'], input[type='text'], input[type='number'], textarea");
  const submitBtn = form.querySelector("button[type='submit'], input[type='submit']");

  const updateSubmitState = (isSpam) => {
    if (!submitBtn) return;
    submitBtn.disabled = isSpam;
    submitBtn.classList.toggle("awd-disabled", isSpam);
  };

  const detectScripts = (text) => {
    const scripts = new Set();
    for (const char of text.trim()) {
      const code = char.charCodeAt(0);
      if (code >= 0x0590 && code <= 0x05FF) scripts.add("he"); // Hebrew
      else if (code >= 0x0600 && code <= 0x06FF) scripts.add("ar"); // Arabic
      else if (code >= 0x0400 && code <= 0x04FF) scripts.add("ru"); // Cyrillic
      else if (code >= 0x4E00 && code <= 0x9FFF) scripts.add("zh"); // Chinese
      else if ((code >= 0x0041 && code <= 0x007A) || (code >= 0x00C0 && code <= 0x00FF)) scripts.add("en"); // Latin
    }
    return scripts;
  };

  const checkSingleInput = (input) => {
    const rawValue = input.value || "";
    const trimmedValue = rawValue.trim().toLowerCase();
    const name = input.name || input.className || input.type;
    let isSpam = false;

    // console.log(`Checking input [${name}]: "${trimmedValue}"`);

    if (input.type === "email" && input.hasAttribute("awd-form-domains")) {
      const baseDomains = input.getAttribute("awd-form-domains").toLowerCase().split(",").map(d => d.trim());
      // console.log(`→ Testing email against domains:`, baseDomains);
      const emailDomain = trimmedValue.split("@")[1];
      if (emailDomain) {
        const matched = baseDomains.find(base => emailDomain.startsWith(base + ".") || emailDomain === base);
        if (matched) {
          // console.log(`🚫 SPAM detected in [${name}]: matched domain "${matched}" in "${emailDomain}"`);
          isSpam = true;
        }
      }
    }

    if (input.type === "tel" && input.hasAttribute("awd-form-phone")) {
      const codes = input.getAttribute("awd-form-phone").split(",").map(c => c.trim());
      // console.log(`→ Testing phone against codes:`, codes);
      const matchedCode = codes.find(code => trimmedValue.startsWith(code));
      if (matchedCode) {
        // console.log(`🚫 SPAM detected in [${name}]: phone starts with blocked code "${matchedCode}"`);
        isSpam = true;
      }
    }

    const isTextLike = input.type === "text" || input.tagName.toLowerCase() === "textarea";
    if (isTextLike) {
      if (input.hasAttribute("awd-form-txt")) {
        const words = input.getAttribute("awd-form-txt").toLowerCase().split(",").map(w => w.trim());
        // console.log(`→ Testing text against blocked words:`, words);
        const matchedWord = words.find(word => trimmedValue.includes(word));
        if (matchedWord) {
          // console.log(`🚫 SPAM detected in [${name}]: contains blocked word "${matchedWord}"`);
          isSpam = true;
        }
      }

      if (trimmedValue !== "" && input.hasAttribute("awd-form-txt-min")) {
        const minLength = parseInt(input.getAttribute("awd-form-txt-min"), 10);
        if (trimmedValue.length < minLength) {
          // console.log(`🚫 SPAM detected in [${name}]: text is shorter than minimum length (${minLength})`);
          isSpam = true;
        }
      }

      if (input.hasAttribute("awd-form-txt-max")) {
        const maxLength = parseInt(input.getAttribute("awd-form-txt-max"), 10);
        if (trimmedValue.length > maxLength) {
          // console.log(`🚫 SPAM detected in [${name}]: text exceeds maximum length (${maxLength})`);
          isSpam = true;
        }
      }

      if (input.hasAttribute("awd-form-lang")) {
        const allowed = input.getAttribute("awd-form-lang").split(",").map(l => l.trim().toLowerCase());
        const detected = Array.from(detectScripts(trimmedValue));
        // console.log(`→ Detected scripts: ${detected.join(", ")}, allowed:`, allowed);
        const disallowed = detected.filter(lang => !allowed.includes(lang));
        if (disallowed.length) {
          // console.log(`🚫 SPAM detected in [${name}]: contains disallowed scripts: ${disallowed.join(", ")}`);
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
      // console.log("🚫 Form submission blocked due to SPAM");
    }
  });

  checkForm();
});
