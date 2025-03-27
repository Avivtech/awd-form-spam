
# awd-form-spam

A small plugin for client-side form spam filtering using custom HTML attributes.  
No setup, no server-side code — just add and go.

<br>

## ✅ Quick Start

1. **Include the script:**

```html
<script src="https://Avivtech.github.io/awd-form-spam/awd-form-spam-filter.js" defer></script>
```

2. **Add the ```awd-form``` attribute to your form**

**Optional: add warnings when input is flagged as spam by adding**

This will add warnings below each input if it is flagged as spam.
Warning element class: ```.awd-warning```

```html
<form awd-form="spam-filter" awd-form-warnings="true">
  ...
</form>
```

3. **Use input-level attributes to enable filtering.**
<br><br>
## Input Attributes

### 📝 Text / Textarea Inputs

| Attribute              | Type     | Description                                          |
|------------------------|----------|------------------------------------------------------|
| `awd-form-txt`         | String   | Blocked words (e.g., `"money, spam, win"`)           |
| `awd-form-txt-min`     | Number   | Minimum length required (e.g., `"5"`)                |
| `awd-form-txt-max`     | Number   | Maximum allowed length (e.g., `"30"`)                |
| `awd-form-lang`        | String   | Allowed scripts (e.g., `"en"`, `"en,he"`)            |

> 💡 Language is detected by character script (Latin, Hebrew, Cyrillic, etc.)

---

### 📧 Email Inputs

| Attribute              | Type     | Description                                          |
|------------------------|----------|------------------------------------------------------|
| `awd-form-domains`     | String   | Block emails by domain (e.g., `"yahoo, hotmail"`)    |

---

### 📱 Phone Inputs

| Attribute              | Type     | Description                                          |
|------------------------|----------|------------------------------------------------------|
| `awd-form-phone`       | String   | Block phone numbers starting with specific prefixes  |

---

## Behavior

- The submit button is automatically disabled if spam is detected.
- The button gets a class of `awd-disabled` when blocked.
- Spam checks run on input, focus, blur, and submit.

---

## Examples

```html
<input type="text" awd-form-txt="win,offer" awd-form-txt-min="5" awd-form-txt-max="20">
```

```html
<input type="email" awd-form-domains="yahoo,hotmail">
```

```html
<textarea awd-form-lang="en,he"></textarea>
```

```html
<input type="tel" awd-form-phone="+7,+91">
```

---

## Why use it?

- Lightweight, no dependencies
- Instant client-side protection
- Easy to customize per field
