document.querySelectorAll("form[awd-form='spam-filter']").forEach((form) => {
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
			if (code >= 0x0590 && code <= 0x05ff) scripts.add("he"); // Hebrew
			else if (code >= 0x0600 && code <= 0x06ff) scripts.add("ar"); // Arabic
			else if (code >= 0x0400 && code <= 0x04ff) scripts.add("ru"); // Cyrillic
			else if (code >= 0x4e00 && code <= 0x9fff) scripts.add("zh"); // Chinese
			else if ((code >= 0x0041 && code <= 0x007a) || (code >= 0x00c0 && code <= 0x00ff)) scripts.add("en"); // Latin
		}
		return scripts;
	};

	const checkSingleInput = (input) => {
		const rawValue = input.value || "";
		const trimmedValue = rawValue.trim().toLowerCase();
		const name = input.name || input.className || input.type;
		let isSpam = false;

		// Show warning message
		const showWarning = (input, message) => {
			const next = input.nextElementSibling;
			if (next && next.classList.contains("awd-warning")) {
				next.remove();
			}
			const div = document.createElement("div");
			div.className = "awd-warning";
			div.textContent = message;
			input.parentNode.insertBefore(div, input.nextSibling);
		};

		// Emails
		if (input.type === "email" && input.hasAttribute("awd-form-domains")) {
			const baseDomains = input
				.getAttribute("awd-form-domains")
				.toLowerCase()
				.split(",")
				.map((d) => d.trim());
			const emailDomain = trimmedValue.split("@")[1];
			if (emailDomain) {
				const matched = baseDomains.find((base) => emailDomain.startsWith(base + ".") || emailDomain === base);
				if (matched) {
					showWarning(input, `${matched} email domain name is not acceptable`);
					isSpam = true;
				}
			}
		}

		// Phones
		if (input.type === "tel" && input.hasAttribute("awd-form-phone")) {
			const codes = input
				.getAttribute("awd-form-phone")
				.split(",")
				.map((c) => c.trim());
			const matchedCode = codes.find((code) => trimmedValue.startsWith(code));
			if (matchedCode) {
				showWarning(input, matchedCode);
				isSpam = true;
			}
		}

		// Text and Textareas
		const isTextLike = input.type === "text" || input.tagName.toLowerCase() === "textarea";
		if (isTextLike) {
			if (input.hasAttribute("awd-form-txt")) {
				const words = input
					.getAttribute("awd-form-txt")
					.toLowerCase()
					.split(",")
					.map((w) => w.trim());
				const matchedWord = words.find((word) => trimmedValue.includes(word));
				if (matchedWord) {
					showWarning(input, matchedWord);
					isSpam = true;
				}
			}

			// Check for minimum length
			if (trimmedValue !== "" && input.hasAttribute("awd-form-txt-min")) {
				const minLength = parseInt(input.getAttribute("awd-form-txt-min"), 10);
				if (trimmedValue.length < minLength) {
					showWarning(input, `text must be at least ${minLength} charachters long`);
					isSpam = true;
				}
			}

			// Check for maximum length
			if (input.hasAttribute("awd-form-txt-max")) {
				const maxLength = parseInt(input.getAttribute("awd-form-txt-max"), 10);
				if (trimmedValue.length > maxLength) {
					showWarning(input, `text must be less then ${maxLength} charachters long`);
					isSpam = true;
				}
			}

			// Check Language
			if (input.hasAttribute("awd-form-lang")) {
				const allowed = input
					.getAttribute("awd-form-lang")
					.split(",")
					.map((l) => l.trim().toLowerCase());
				const detected = Array.from(detectScripts(trimmedValue));
				const disallowed = detected.filter((lang) => !allowed.includes(lang));
				if (disallowed.length) {
					showWarning(input, disallowed[0]);
					isSpam = true;
				}
			}
		}

		return isSpam;
	};

	const checkForm = () => {
		let isSpam = false;
		inputs.forEach((input) => {
			if (checkSingleInput(input)) isSpam = true;
		});
		updateSubmitState(isSpam);
		return isSpam;
	};

	inputs.forEach((input) => {
		["input", "focus", "blur"].forEach((evt) => {
			input.addEventListener(evt, () => {
				const spam = checkSingleInput(input);
				updateSubmitState(spam || checkForm());
			});
		});
	});

	form.addEventListener("submit", (e) => {
		if (checkForm()) {
			e.preventDefault();
		}
	});

	checkForm();
});
