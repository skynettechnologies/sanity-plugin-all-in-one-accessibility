# All in One Accessibility® – Sanity Plugin

This [Sanity accessibility plugin](https://www.skynettechnologies.com/sanity-website-accessibility) adds an accessible experience for users with visual, auditory, motor, or cognitive disabilities. It supports assistive technologies, offers customizable updates, and enhances overall usability according to WCAG 2.1, 2.2, ADA, EAA, Section 508, France RGAA, California Unruh, European EAA EN 301 549, UK Equality Act, Spain UNE 139803:2012, Australian DDA, Israeli Standard 5568, Ontario AODA, Canada ACA, German BITV, Brazilian Inclusion Law (LBI 13.146/2015), JIS X 8341 (Japan), Italian Stanca Act, Indian RPwD Act, Switzerland DDA, and other [accessibility standards](https://www.skynettechnologies.com/accessibility-standards).

Whether you're aiming to increase compliance, expand audience reach, or create a more user-friendly browsing experience, the Sanity accessibility plugin delivers a practical, customized solution that enhances accessibility without requiring any coding or design changes. The free accessibility Sanity plugin is an ideal starting point for Sanity site owners who want to improve accessibility quickly and cost-effectively. The Sanity accessibility widget is also ideal for Sanity website owners, agencies, businesses of all sizes, and organizations seeking accessibility compliance, while ultimately benefiting users with disabilities who need a better, more inclusive digital experience.

This [free website accessibility widget](https://www.skynettechnologies.com/free-website-accessibility-widget) quickly adds essential accessibility features through a lightweight, easy to install solution that supports inclusive browsing and compliance efforts.

---

## Which features are available in the free accessibility Sanity widget?

- Auto-detect language
- Supports 190+ multi-languages – ideal for global Sanity sites
- Skip to Navigation / Content / Footer
- Content Adjustment Options
- Visual & Color Adjustments
- Free Sanity accessibility widget customization including colors, size, icon, and position
- Reading mask
- Accessibility statement

Explore the [free accessibility widget features guide](https://www.skynettechnologies.com/sites/default/files/Free-Accessibility-Widget-Features-Guide.pdf).

---

## SECURITY & PRIVACY NOTES

- This Free Accessibility Sanity plugin follows several data and application security practices, including ISO 9001:2015 & ISO 27001:2022, GDPR, CCPA, COPPA, HIPAA, and SOC 2 Type II.
- Skynet Technologies USA LLC is an organizational member of IAAP and of W3C.
- No personal data is intentionally stored by the plugin itself. Site owners are responsible for reviewing their own compliance requirements.

---

## LIMITATIONS

- Some advanced features require a commercial subscription.

For more details, visit [**Sanity accessibility plugin**](https://www.skynettechnologies.com/sanity-website-accessibility).

---

## FAQs

**Does this free Sanity accessibility plugin support multilingual Sanity sites?**

Yes. It supports 190+ languages.

**How can I upgrade from free to paid Sanity accessibility widget for upgrading accessibility features?**

Upgrade to a paid subscription with **90+ advanced features** and take your website's accessibility to the next level. Checkout the steps for upgrading [free to paid Sanity accessibility widget](https://www.skynettechnologies.com/blog/upgrade-all-in-one-accessibility-free-widget-to-paid-version#free-paid-version).

**What additional features are available in the paid version of Sanity WCAG ADA EAA plugin?**

The paid version of the Sanity accessibility widget includes features like screen reader, voice navigation, talk & type, virtual keyboard, accessibility profiles tailored for different users with disabilities, Libras (Brazilian sign language), dictionary search, multi-language support (190+ languages), and many more. Pricing starts from $25 / month. Explore more information about the [accessibility widget](https://www.skynettechnologies.com/all-in-one-accessibility) and buy now.

---

## Supported Languages (190+ Languages)

English (USA), English (UK), English (Australian), English (Canadian), English (South Africa), Español, Español (Mexicano), Deutsch, عربى, Português, Português (Brazil), 日本語, Français, Italiano, Polski, Pусский, 中文, 中文 (Traditional), עִברִית, Magyar, Slovenčina, Suomenkieli, Türkçe, Ελληνικά, Latinus, Български, Català, Čeština, Dansk, Nederlands, हिंदी, Bahasa Indonesia, 한국인, Lietuvių, Bahasa Melayu, Norsk, Română, Slovenščina, Svenska, แบบไทย, Українська, Việt Nam, বাঙালি, සිංහල, አማርኛ, Hmoob, မြန်မာ, Eesti keel, latviešu, Cрпски, Hrvatski, ქართული, ʻŌlelo Hawaiʻi, Cymraeg, Cebuano, Samoa, Kreyòl ayisyen, Føroyskt, Crnogorski, Azerbaijani, Euskara, Tagalog, Galego, Norsk Bokmål, فارسی, ਪੰਜਾਬੀ, shqiptare, Hայերեն, অসমীয়া, Aymara, Bamanankan, беларускі, bosanski, Corsu, ދިވެހި, Esperanto, Eʋegbe, Frisian, guarani, ગુજરાતી, Hausa, íslenskur, Igbo, Gaeilge, basa jawa, ಕನ್ನಡ, қазақ, ខ្មែរ, Kinyarwanda, Kurdî, Кыргызча, ພາສາລາວ, Lingala, Luganda, lëtzebuergesch, македонски, Malagasy, മലയാളം, Malti, Maori, मराठी, Монгол, नेपाली, Sea, ଓଡିଆ, Afaan Oromoo, پښتو, Runasimi, संस्कृत, Gàidhlig na h-Alba, Sesotho, Shona, سنڌي, Soomaali, basa Sunda, kiswahili, тоҷикӣ, தமிழ், Татар, తెలుగు, ትግሪኛ, Tsonga, Türkmenler, Ride, اردو, ئۇيغۇر, o'zbek, isiXhosa, יידיש, Yoruba, Zulu, भोजपुरी, डोगरी, कोंकणी, Kurdî, Krio, मैथिली, Meiteilon, Mizo tawng, Sepedi, Ilocano, دری

---

## Installation Steps

Explore [Sanity WCAG accessibility widget installation steps](https://www.skynettechnologies.com/blog/sanity-web-accessibility-widget-installation).

```sh
npm install sanity-plugin-all-in-one-accessibility
```

### Setup & Usage

Add it as a plugin in `sanity.config.ts` (or .js):

```ts
import {defineConfig} from 'sanity'
import {AllinOneAccessibilityPlugin} from 'sanity-plugin-all-in-one-accessibility'

export default defineConfig({
  //...
  plugins: [AllinOneAccessibilityPlugin({})],
})
```

### Add the Script

Place the following script in the **header** or **footer** section of your website or frontend:

```html
<script>
  setTimeout(() => { 
    let aioa_script_tag = document.createElement("script"); 
    aioa_script_tag.src = "https://www.skynettechnologies.com/accessibility/js/all-in-one-accessibility-js-widget-minify.js?colorcode=#420083&token=null&position=bottom_right";  
    aioa_script_tag.id = "aioa-adawidget";
    aioa_script_tag.defer = "true"; 
    document.getElementsByTagName("body")[0].appendChild(aioa_script_tag); 
  }, 3000);
</script>
```

---

## Visit the Sanity Site Accessibility Improvements demo to see how it performs with improved accessibility features

[![All in One Accessibility](https://img.youtube.com/vi/X70XtvGyvSs/0.jpg)](https://youtu.be/X70XtvGyvSs)

---

## CORS Policy Configuration

To avoid CORS policy issues, ensure the following URLs are allowed in your website. These URLs should be added to your CORS configuration or trusted domains list.

| **Domain** | **Description** | **Usage** |
| --- | --- | --- |
| https://\*.skynettechnologies.com | Skynet Technologies (Global Domain) | API access and resources |
| https://\*.skynettechnologies.us | Skynet Technologies (US Domain) | API access and resources |
| https://\*.googleapis.com | Google APIs | Services like Fonts, Translation |
| https://\*.gstatic.com | Fonts APIs | Custom Fonts |
| https://vlibras.gov.br | VLibras - Brazilian Sign Language Service | Sign Language |

### Instructions

1. Update your server's CORS configuration to include these URLs.
2. Ensure wildcard subdomains (\*) are supported where necessary.
3. Verify the application functionality by testing requests to these domains.
4. If issues persist, consult the documentation for CORS configuration guidance.

---

## Configuration

To configure the widget, access the Admin Panel and head to the **All in One Accessibility** menu in the dashboard. From there, you can register [here](https://ada.skynettechnologies.us/trial-subscription) with a 10-day free trial.

---

## Documentation

- [**Sanity Accessibility Plugin**](https://www.skynettechnologies.com/sanity-website-accessibility)
- [**How to install an Accessibility Sanity ADA compliance Plugin?**](https://www.skynettechnologies.com/blog/sanity-web-accessibility-widget-installation)
- [**Sanity WCAG compliance accessibility – Features Guide**](https://www.skynettechnologies.com/sites/default/files/accessibility-widget-features-list.pdf)

---

## Submit a Support Request

Please visit our [**support page**](https://www.skynettechnologies.com/report-accessibility-problem) and fill out the form. Our team will get back to you as soon as possible.

## Send Us an Email

Alternatively, you can send an email to our support team: [**hello@skynettechnologies.com**](mailto:hello@skynettechnologies.com)

---

## Accessibility Paid Add-on Services

**[Sanity manual accessibility audit](https://www.skynettechnologies.com/website-accessibility-audit)**

- Enhance inclusivity and user experience by evaluating your Sanity website's accessibility by a [web accessibility consultant](https://www.skynettechnologies.com/web-accessibility-consultant).
- WCAG 2.0 / WCAG 2.1 / WCAG 2.2 Level AA conformance testing
- Automated, semi-automated testing
- Manual testing
- Simple before-after UI/UX recommendations on how to fix the issues
- Comprehensive audit report

**[Sanity site manual accessibility remediation](https://www.skynettechnologies.com/full-website-accessibility-remediation)**

Enhance Sanity website accessibility and inclusivity with our manual accessibility remediation add-on. This service includes fixing accessibility issues and thorough remediation of your website manually. Our experts ensure accessibility with WCAG standards, improve user experience for those with disabilities, and provide a detailed report on the improvements made.

**[PDF / Document Accessibility Remediation](https://www.skynettechnologies.com/pdf-accessibility-remediation)**

The PDF / Document Remediation provides a list of inaccessible PDFs and remediated PDFs from where you can request PDF remediation service.

**[VPAT Report / Accessibility Conformance Report (ACR)](https://www.skynettechnologies.com/vpat-accessibility-conformance-report)**

The Voluntary Product Accessibility Template (VPAT), also known as an ACR (Accessibility Conformance Report), starts with an audit and provides current details for an accessible website, application, or any other digital assets.

---

## Accessibility Sanity Widget Paid Add-ons

**[White Label Accessibility](https://www.skynettechnologies.com/all-in-one-accessibility/addons#accessibility-widget-add-ons)**

Remove the Skynet Technologies logo as well as all of the footer links, popups, report a problem link and more for full white label control.

**[Instant live site translations](https://www.skynettechnologies.com/all-in-one-accessibility/addons#accessibility-widget-add-ons) for Sanity sites**

Translate your Sanity site into over 190 languages instantly to enhance accessibility for non-native speakers, individuals with language acquisition difficulties, and those with learning disabilities.

**[Modify Accessibility Menu](https://www.skynettechnologies.com/all-in-one-accessibility/addons#accessibility-widget-add-ons) for Sanity Site**

Build and fine-tune the widget with the Modify Menu option. Reorder, remove and restructure the widget buttons to fit your users' specific accessibility needs.

---

## Sanity Accessibility Partnership Opportunities

**[Sanity accessibility agencies partnership](https://www.skynettechnologies.com/agency-partners)**

Partner with us as an agency to provide comprehensive Sanity ADA, EAA, WCAG accessibility solutions to clients. Get access to exclusive resources, training, and support to implement and manage accessibility features effectively.

**[Sanity accessibility affiliate partnership](https://www.skynettechnologies.com/affiliate-partner)**

Sign up for our affiliate program and earn commissions by promoting the accessibility Sanity plugin. Share our widget with your network and help businesses improve their website accessibility while generating revenue.

For more details, explore [**Sanity accessibility partnership opportunities**](https://www.skynettechnologies.com/partner-program).

---

## Screenshots

![App Screenshot](https://www.skynettechnologies.com/sites/default/files/screenshot-1-free.jpg?v=3)

![App Screenshot](https://www.skynettechnologies.com/sites/default/files/screenshot-2-free.jpg?v=3)

![App Screenshot](https://www.skynettechnologies.com/sites/default/files/screenshot-3-free.jpg?v=3)

![App Screenshot](https://www.skynettechnologies.com/sites/default/files/screenshot-4-free.jpg?v=3)

![App Screenshot](https://www.skynettechnologies.com/sites/default/files/screenshot-5-free.jpg?v=3)

![App Screenshot](https://www.skynettechnologies.com/sites/default/files/screenshot-6-free.jpg?v=3)

![App Screenshot](https://www.skynettechnologies.com/sites/default/files/screenshot-7-free.jpg?v=3)

---

## Credits

This plugin is developed and maintained by [website accessibility company](https://www.skynettechnologies.com/) – Skynet Technologies USA LLC

## Current Maintainers

- [**Skynet Technologies USA LLC**](https://github.com/skynettechnologies)

---

## License

[MIT](LICENSE) © Skynet Technologies USA LLC
