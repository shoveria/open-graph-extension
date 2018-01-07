//REFERENCE
//https://www.sitepoint.com/community/t/how-to-create-a-chrome-extension-in-10-minutes-flat/118033
//https://developer.chrome.com/extensions
//https://developer.chrome.com/extensions/samples
//https://validator.w3.org/nu/#textarea
//https://developer.twitter.com/en/docs/tweets/optimize-with-cards/overview/markup
//http://brianflove.com/2013/11/01/open-graph-meta-tags/
//https://www.w3schools.com/jsref/met_his_back.asp
//https://stackoverflow.com/questions/8914476/facebook-open-graph-meta-tags-maximum-content-length
//https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
//https://developer.chrome.com/extensions/examples/api/browserAction/set_icon_path.zip

checkBrowserLocation();


function checkBrowserLocation() {
//check if you are in the information Center
var pageTitle = document.title.slice(0, 18);
try {
    if (pageTitle == 'Information Center') {
        analyzePage(); //runs page analysis if inside
        console.log('Hooray! OpenGraph data copied to clipboard!');
      } else {
        console.log('Sowwy. OpenGraph data was not generated.');
      }
    }
    catch(err) {
      console.log(err);
    } //end try
} //end checkBrowserLocation function


function copyTextToClipboard(text) {
  var textArea = document.createElement("textarea");

  //
  // *** This styling is an extra step which is likely not required. ***
  //
  // Why is it here? To ensure:
  // 1. the element is able to have focus and selection.
  // 2. if element was to flash render it has minimal visual impact.
  // 3. less flakyness with selection and copying which **might** occur if
  //    the textarea element is not visible.
  //
  // The likelihood is the element won't even render, not even a flash,
  // so some of these are just precautions. However in IE the element
  // is visible whilst the popup box asking the user for permission for
  // the web page to copy to the clipboard.
  //

  // Place in top-left corner of screen regardless of scroll position.
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;

  // Ensure it has a small width and height. Setting to 1px / 1em
  // doesn't work as this gives a negative w/h on some browsers.
  textArea.style.width = '2em';
  textArea.style.height = '2em';

  // We don't need padding, reducing the size if it does flash render.
  textArea.style.padding = 0;

  // Clean up any borders.
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';

  // Avoid flash of white box if rendered for any reason.
  textArea.style.background = 'transparent';


  textArea.value = text;

  document.body.appendChild(textArea);

  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    // console.log('Copying text command was ' + msg); //hiding console log
  } catch (err) {
    // console.log('Oops, unable to copy'); //hiding console log
  }

  document.body.removeChild(textArea);
}


//capture article details for OpenGraph tags
function analyzePage() {
  //get title of article
  var articleTitle = document.querySelector('.heading').innerText,
  articlePublished = document.querySelectorAll('h4')[0].innerText.trim(),

  //instantiate some misc variables
  htmlComments = ['<!-- OpenGraph Tags -->', '<!-- End OpenGraph Tags -->'],
  articleUrl = document.URL,
  siteName = 'Virginia Farm Bureau Insurance',
  locale = 'en_US',
  twitterSite = '@VFBInsurance',
  twitterCreator = '@VFBInsurance',

  //article description and clean up - module allows 150 character description then truncates, OpenGraph allows 300 characters in post, 110 char in comment
  description = document.getElementById('MetaDescription').content;
  description = description.replace(/\n/, '');

  //get the tags for the article
  articleTags = document.getElementsByClassName('tags'),
  articleTags = articleTags[0].getElementsByTagName('a'),

  //only get article images from content area
  articleImages = document.getElementsByClassName('content'),
  articleImages = articleImages[0].getElementsByTagName('img'),

  //define ogData object
  ogData = {
    title: '<meta property="og:title" content="' + articleTitle +'" />',
    type: '<meta property="og:type" content="article" />',
    description: '<meta property="og:description" content="' + description + '" />',
    author: '<meta property="article:author" content="Virginia Farm Bureau Insurance" />',
    section: '<meta property="article:section" content="Insurance Information Center" />',
    published: '<meta property="article:published_time" content="' + articlePublished +'" />',
    url: '<meta property="og:url" content="' + articleUrl + '"/>',
    site: '<meta property="og:site_name" content="' + siteName + '" />',
    locale: '<meta property="og:locale" content="'+ locale +'" />',
    twitterCard: '<meta property="twitter:card" content="' + description + '" />',
    twitterSite: '<meta property="twitter:site" content="@VFBInsurance" />',
    twitterCreator: '<meta property="twitter:creator" content="@VFBInsurance" />',
    twitterImage: '<meta property="twitter:image" content="' + articleImages[0].src + '" />',
    twitterImageAlt: '<meta property="twitter:image:alt" content="' + articleImages[0].alt + '" />'
  };

  //put the tags in the ogData
  var tags = [];

  for ( i = 0 ; i < articleTags.length ; i++ ) {
    tags[i] = '<meta property="article:tag" content="' + articleTags[i].innerText + '" />';
    ogData.tags = tags;
  }

  //put the images in the ogData
  var images = [],
  ogComplete = '',
  articleImagesHttp,
  articleImageDetails = '';

  for ( i = 0 ; i < articleImages.length ; i++ ) {
    articleImagesHttp = articleImages[i].src.replace('https','http'); //site forces ssl for connections, needed reggo url string for og:image tag
    images[i] = {
      httpsrc: '<meta property="og:image" content="' + articleImagesHttp + '" />',
      src: '<meta property="og:image:secure_url" content="' + articleImages[i].src + '" />',
      alt: '<meta property="og:image:alt" content="' + articleImages[i].alt + '" />'
    };

    ogData.images = images;
    //update variable to append to end of ogComplete string so og:image data shows up in correct order
    articleImageDetails += ogData.images[i].httpsrc + '\n' + ogData.images[i].src + '\n' + ogData.images[i].alt;
  }

  //concat object info
  ogComplete =  htmlComments[0] + '\n' +
                ogData.title + '\n' +
                ogData.type + '\n' +
                ogData.url + '\n' +
                ogData.site + '\n' +
                ogData.locale + '\n' +
                ogData.description + '\n' +
                ogData.author + '\n'+
                ogData.section + '\n' +
                ogData.published + '\n' +
                ogData.tags + '\n' +
                articleImageDetails + '\n' +
                ogData.twitterCard + '\n' +
                ogData.twitterSite + '\n' +
                ogData.twitterCreator + '\n' +
                ogData.twitterImage + '\n' +
                ogData.twitterImageAlt + '\n' +
                htmlComments[1];

  ogComplete.toString();

  //remove commas and clean up string for copy/paste
  ogComplete = ogComplete.replace(/(\>\,\<)|(\>\<)/g, '\>\n\<');
  // console.log(ogComplete);
  copyTextToClipboard(ogComplete);
}
