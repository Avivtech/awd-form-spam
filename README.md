# awd-form-spam
A small plugin for form spam filtering

Use attributes to enhance your form to disable spam.

<br><br>
## Useage:
On your Forms add: awd-form='spam-filter'

### text and textareas inputs:
- ```awd-form-txt``` String (any word or text you want to be detected as spam. ```'money, spam, win'```)
- ```awd-form-txt-min``` Number (any number will be the minimum chrachters to type in. ```'5'```)
- ```awd-form-txt-max``` Number (any number will be the maximum chrachters to type in. ```'30'```)

### email inputs:
- ```awd-form-domains``` String (any domain name you add will be detected as spam. 'yahoo, hotmail')

<br><br>
## Examples:

```<input type="text" awd-form-txt-min="4" awd-form-txt-max="20">``` - This will disable form if text is shorter then 4 or longer then 20.

```<input type="email" awd-form-domains="yahoo, hotmail" >``` - This will disable form if email domain name is yahoo or hotmail.
