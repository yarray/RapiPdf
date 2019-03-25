import createPdf from '@/utils/pdf-gen';

let tmpl = document.createElement('template');
tmpl.innerHTML = `
  <style>
  :host{
    --primary-color:orangered;
    --border-radius:2px;
    --input-bg:#fff;
    --fg:#333;
    --primary-text:#fff;
    display:block;
    width:350px;
  }

  .spec-input {
    border-radius:var(--border-radius);
    border:1px solid var(--primary-color);
    background:var(--input-bg);
    color:var(--fg);
    transition: border .2s;
    outline: none;
    font-size:13px;
    padding:6px 5px;
    box-sizing: border-box;
    flex:1;
  }
  .spec-input:focus {
    outline: 1px dotted var(--fg);
    outline-offset: -3px;
  }

  .btn-default {
    border-radius: 0 var(--border-radius) var(--border-radius) 0;
    font-weight: 600;
    display: inline-block;
    padding: 6px 16px;
    font-size: 12px;
    outline: none;
    outline-offset: -2px;
    line-height: 1;
    text-align: center;
    white-space: nowrap;
    background-color:var(--primary-color);
    color:var(--primary-text);
    border: 0px solid var(--primary-color);
    transition: background-color 0.2s;
    user-select: none;
    cursor: pointer;
  }
  .btn-default:focus{
    outline: 1px solid var(--primary-text);
  }
  
  </style>
  <div>
    <div style='display:flex; width:100%;'>
      <input class="spec-input" id="spec-url" type="text"  placeholder="Spec URL" value="" tabindex="0">
      <button class="btn-default" style="margin-left:-2px" tabindex="0"><slot></slot></button>
    </div>  
  </div>  
`;

export default customElements.define('rapi-pdf', class RapiPdf extends HTMLElement {
  constructor() {
    super(); // always call super() first in the constructor.
    let shadowRoot = this.attachShadow({mode: 'open'});
    let elFromTemplate = tmpl.content.cloneNode(true);
    this.inputEl = elFromTemplate.querySelector(".spec-input");
    this.btnEl = elFromTemplate.querySelector(".btn-default");
    
    // Initialize attributes if not defined 
    shadowRoot.appendChild(elFromTemplate);



  }

  connectedCallback() {
    // Add Event Listeners
    this.inputEl.addEventListener('change', e => this.inputOnChange(e) );    
    this.inputEl.addEventListener('keyup', e => this.onKeyUp(e) );    
    this.btnEl.addEventListener('click', e => this.generatePdf() );
  }

  disconnectedCallback() {
    // Remove Event Listeners
    this.inputEl.removeEventListener('change', e => this.inputOnChange(e) );    
    this.inputEl.removeEventListener('keyup', e => this.onKeyUp(e) );    
    this.btnEl.removeEventListener('click', e => this.generatePdf() );
  }

  static get observedAttributes() {
    return ['spec-url', 'button-bg', 'input-bg', 'button-color', 'input-color'];
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    console.log(name);
    switch (name) {
    case 'spec-url':
      if (oldValue !== newValue){
        this.inputEl.value = this.getAttribute('spec-url');
      }
      break;
    case 'button-bg':
      this.btnEl.style.backgroundColor = newValue;
      this.inputEl.style.borderColor = newValue;
      return true;
    case 'button-color':
      this.btnEl.style.color = newValue;
      return true;
    case 'input-bg':
      this.inputEl.style.backgroundColor = newValue;
      return true;
    case 'input-color':
      this.inputEl.style.color = newValue;
      return true;
    }
    return true;
  }

  get specUrl() {
    return this.getAttribute('spec-url');
  }
  set specUrl(newSpecUrl) {
    this.setAttribute('spec-url', newSpecUrl);
  }

  inputOnChange(e){
    this.specUrl = e.target.value;
  }

  onKeyUp(e){
    if (e.keyCode === 13) {
      this.generatePdf();
    }
  }

  generatePdf(){
    let pdfPrimaryColor   = this.getAttribute('pdf-primary-color');
    let pdfAlternateColor = this.getAttribute('pdf-alternate-color');
    let pdfTitle          = this.getAttribute('pdf-title')===null?'API Reference':this.getAttribute('pdf-title');
    let pdfCoverText      = this.getAttribute('pdf-cover-text')?this.getAttribute('pdf-cover-text'):'';
    let pdfSecurityText   = this.getAttribute('pdf-security-text')?this.getAttribute('pdf-security-text'):'';
    let pdfApiText        = this.getAttribute('pdf-api-text')?this.getAttribute('pdf-api-text'):'';
    let pdfFooterText     = this.getAttribute('pdf-footer-text')?this.getAttribute('pdf-footer-text'):'';
    let includeInfo       = this.getAttribute('include-info')==='false'?false:true;
    let includeToc        = this.getAttribute('include-toc')==='false'?false:true;
    let includeSecurity   = this.getAttribute('include-security')==='false'?false:true;
    let includeApiDetails = this.getAttribute('include-api-details')==='false'?false:true;
    let includeApiList    = this.getAttribute('include-api-list')==='true'?true:false;

    let options = {
      pdfPrimaryColor,
      pdfAlternateColor,
      pdfTitle,
      pdfCoverText,
      pdfSecurityText,
      pdfApiText,
      pdfFooterText,
      includeInfo,
      includeToc,
      includeSecurity,
      includeApiDetails,
      includeApiList
    }
    createPdf(this.specUrl, options);
  }

});
