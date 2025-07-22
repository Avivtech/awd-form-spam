console.log("AWD Form Spam Filter Loaded");

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
			if (code >= 0x0590 && code <= 0x05ff) scripts.add("he");
			else if (code >= 0x0600 && code <= 0x06ff) scripts.add("ar");
			else if (code >= 0x0400 && code <= 0x04ff) scripts.add("ru");
			else if (code >= 0x4e00 && code <= 0x9fff) scripts.add("zh");
			else if ((code >= 0x0041 && code <= 0x007a) || (code >= 0x00c0 && code <= 0x00ff)) scripts.add("en");
		}
		return scripts;
	};

	const wrapFields = () => {
		inputs.forEach((input) => {
			const wrapper = document.createElement("div");
			wrapper.style.position = "relative";

			input.parentNode.insertBefore(wrapper, input);
			wrapper.appendChild(input);

			const warning = document.createElement("div");
			warning.className = "awd-warning";
			warning.style.pointerEvents = "none";
			warning.style.display = "inline-block";
			warning.style.opacity = "0";
			warning.style.transition = "opacity 300ms ease";
			wrapper.appendChild(warning);
		});
	};

	// Show a warning message for the input field
	const showWarning = (input, message) => {
		console.log(`Spam detected in field "${input.name || input.className || input.type}": ${message}`);
		const form = input.closest("form");
		if (!form || form.getAttribute("awd-form-warnings") !== "true") return;

		// Remove any existing warnings first
		removeWarning(input);

		// Create a new warning element
		const warning = document.createElement("div");
		warning.className = "awd-warning";
		warning.textContent = `This field won't accept "${message}"`;
		warning.style.pointerEvents = "none";
		warning.style.display = "inline-block";
		warning.style.opacity = "1";
		warning.style.transition = "opacity 300ms ease";

		input.parentNode.appendChild(warning);
	};

	// Remove any existing warning messages for the input field
	const removeWarning = (input) => {
		const form = input.closest("form");
		if (!form || form.getAttribute("awd-form-warnings") !== "true") return;

		// Remove all .awd-warning elements inside this input wrapper
		const warnings = input.parentNode.querySelectorAll(".awd-warning");
		warnings.forEach((el) => el.remove());
	};

	const checkSingleInput = (input) => {
		const rawValue = input.value || "";
		const trimmedValue = rawValue.trim().toLowerCase();
		const name = input.name || input.className || input.type;
		let isSpam = false;

		if (trimmedValue === "") {
			removeWarning(input);
			return false;
		}

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
					showWarning(input, matched);
					isSpam = true;
				}
			}
		}

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

			if (input.hasAttribute("awd-form-txt-min")) {
				const minLength = parseInt(input.getAttribute("awd-form-txt-min"), 10);

				if (trimmedValue.length >= minLength) {
					input.dataset.awdMinChecked = "true";
				}
				const shouldCheck = input.dataset.awdMinChecked === "true";
				if (shouldCheck && trimmedValue.length < minLength) {
					showWarning(input, `min ${minLength}`);
					isSpam = true;
				}
			}

			if (input.hasAttribute("awd-form-txt-max")) {
				const maxLength = parseInt(input.getAttribute("awd-form-txt-max"), 10);
				if (trimmedValue.length > maxLength) {
					showWarning(input, `max ${maxLength}`);
					isSpam = true;
				}
			}

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

		if (!isSpam) removeWarning(input);
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
		inputs.forEach((input) => {
			input.dataset.awdForceMin = "true";
		});

		if (checkForm()) {
			e.preventDefault();
		}

		inputs.forEach((input) => {
			delete input.dataset.awdForceMin;
		});
	});

	wrapFields();
	checkForm();
});
