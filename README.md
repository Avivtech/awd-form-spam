
# awd-form-spam

A small plugin for client-side form spam filtering using custom HTML attributes.  
No setup, no server-side code — just add and go.

---

## ✅ Quick Start

1. **Include the script:**

```html
<script src="https://Avivtech.github.io/awd-form-spam/awd-form-spam-filter.js" defer></script>
```

2. **Add `awd-form="spam-filter"` to your form**

Optional: To show warnings under fields when spam is detected, add `awd-form-warnings="true"`.

```html
<form awd-form="spam-filter" awd-form-warnings="true">
  ...
</form>
```

> Warnings will appear as elements with the class: `.awd-warning`

3. **Add attributes to input fields to control spam filtering**

---

## 🧩 Input Attributes

### 📝 Text / Textarea Inputs

| Attribute            | Type   | Description                                                |
|----------------------|--------|------------------------------------------------------------|
| `awd-form-txt`       | String | Blocked words (e.g. `"money, spam, win"`)                 |
| `awd-form-txt-min`   | Number | Minimum required characters (e.g. `"5"`)                   |
| `awd-form-txt-max`   | Number | Maximum allowed characters (e.g. `"30"`)                   |
| `awd-form-lang`      | String | Allowed scripts/languages (e.g. `"en"`, `"en,he,fr"`)      |

> 💡 Script detection includes Latin (`en`), Hebrew (`he`), Arabic (`ar`), Cyrillic (`ru`), and Chinese (`zh`).

---

### 📧 Email Inputs

| Attribute             | Type   | Description                                             |
|-----------------------|--------|---------------------------------------------------------|
| `awd-form-domains`    | String | Block email domains (e.g. `"yahoo, hotmail"`)           |

---

### 📱 Phone Inputs

| Attribute             | Type   | Description                                             |
|-----------------------|--------|---------------------------------------------------------|
| `awd-form-phone`      | String | Block phone numbers starting with given prefixes        |

---

## ⚙️ Behavior

- Submit button is disabled if spam is detected.
- Button receives a `awd-disabled` class while blocked.
- Spam checks are triggered on: `input`, `focus`, `blur`, and `submit`.

---

## 🧪 Examples

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
<input type="tel" awd-form-phone="1,972">
```

---

## 💡 Why Use It?

- Lightweight, no external dependencies
- No setup or configuration
- Instant form hardening against common spam inputs
