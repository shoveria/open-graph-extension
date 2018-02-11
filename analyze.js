//Get page url to determine if the user is on a product page or on a blog page

var pageTitle = document.title.slice(0, 18);

if (pageTitle === 'Information Center') {
  console.log('You are in the Information Center');
  analyzeInfoCenterPage();
}
else {
  console.log('You may be on a product page.');
  try {
    analyzeProductPage();
  }
  catch (err) {
    console.log(err);
  }
}



//Generate Open Graph tags for product page

function copyTextToClipboard(text) {
  var textArea = document.createElement("textarea");

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


function analyzeInfoCenterPage() {
  //get title of article
  var articleTitle = document.querySelector('.heading').innerText;
  var articlePublished = document.querySelectorAll('h4')[0].innerText.trim();

  //instantiate some misc variables
  var htmlComments = ['<!-- OpenGraph Tags -->', '<!-- End OpenGraph Tags -->'];
  var ogComplete;

  //article description and clean up - module allows 150 character description then truncates, OpenGraph allows 300 characters in post, 110 char in comment
  var description = document.getElementById('MetaDescription').content;
  description = description.replace(/\n/, '');

  //get the tags for the article
  var articleTags = document.getElementsByClassName('tags');
  articleTags = articleTags[0].getElementsByTagName('a');

  //only get article images from content area
  var articleImages = document.getElementsByClassName('content');
  articleImages = articleImages[0].getElementsByTagName('img');

  //define ogData object
  var ogData =
    ['<meta property="og:title" content="' + articleTitle + '" />',
    '<meta property="og:type" content="article" />',
    '<meta property="og:description" content="' + description + '" />',
    '<meta property="article:author" content="Virginia Farm Bureau Insurance" />',
    '<meta property="article:section" content="Insurance Information Center" />',
    '<meta property="article:published_time" content="' + articlePublished + '" />',
    '<meta property="og:url" content="' + document.URL + '"/>',
    '<meta property="og:site_name" content="Virginia Farm Bureau Insurance" />',
    '<meta property="og:locale" content="en_US" />',
    '<meta property="twitter:card" content="' + description + '" />',
    '<meta property="twitter:site" content="@VFBInsurance" />',
    '<meta property="twitter:creator" content="@VFBInsurance" />',
    '<meta property="twitter:image" content="' + articleImages[0].src + '" />',
    '<meta property="twitter:image:alt" content="' + articleImages[0].alt + '" />'];

  //put the tags in the ogData
  var tags = [];

  for (i = 0; i < articleTags.length; i++) {
    tags[i] = '<meta property="article:tag" content="' + articleTags[i].innerText + '" />';
    ogData.push(tags[i]);
  }

  //put the images in the ogData
  var images = [];
  var articleImagesHttp;
  var articleImageDetails;

  for (i = 0; i < articleImages.length; i++) {
    articleImagesHttp = articleImages[i].src.replace('https', 'http'); //site forces ssl for connections, needed reggo url string for og:image tag
    images[i] = {
      httpsrc: '<meta property="og:image" content="' + articleImagesHttp + '" />',
      src: '<meta property="og:image:secure_url" content="' + articleImages[i].src + '" />',
      alt: '<meta property="og:image:alt" content="' + articleImages[i].alt + '" />'
    };

    //update variable to append to end of ogComplete string so og:image data shows up in correct order
    articleImageDetails += images[i].httpsrc + '\n' + images[i].src + '\n' + images[i].alt;

  }

  ogData.push(articleImageDetails);

  function readOgData(item, index) {
    ogComplete += item + '\n';
  }

  ogData.forEach(readOgData);

  ogComplete.toString();

  //remove commas and clean up string for copy/paste
  ogComplete = ogComplete.replace(/(\>\,\<)|(\>\<)/g, '\>\n\<').replace(/undefined/g, '');
  // console.log(ogComplete);
  copyTextToClipboard(ogComplete);
}

//capture article details for OpenGraph tags
function analyzeProductPage() {

  //instantiate some misc variables
  var htmlComments = ['<!-- OpenGraph Tags -->', '<!-- End OpenGraph Tags -->'];
  var ogComplete;

  //article description and clean up - module allows 150 character description then truncates, OpenGraph allows 300 characters in post, 110 char in comment
  var description = document.getElementById('MetaDescription').content;
  description = description.replace(/\n/, '');

  //only get article images from content area
  var articleImages = document.getElementsByClassName('coverage-panel');
  articleImages = articleImages[0].getElementsByTagName('img');

  //define ogData object
  var ogData =
    ['<meta property="og:title" content="' + document.title + '" />',
      '<meta property="og:type" content="article" />',
    '<meta property="og:description" content="' + description + '" />',
      '<meta property="article:author" content="Virginia Farm Bureau Insurance" />',
      '<meta property="article:section" content="Insurance Product" />',
    '<meta property="og:url" content="' + document.URL + '"/>',
      '<meta property="og:site_name" content="Virginia Farm Bureau Insurance" />',
      '<meta property="og:locale" content="en_US" />',
    '<meta property="twitter:card" content="' + description + '" />',
      '<meta property="twitter:site" content="@VFBInsurance" />',
      '<meta property="twitter:creator" content="@VFBInsurance" />',
    '<meta property="twitter:image" content="' + articleImages[0].src + '" />',
    '<meta property="twitter:image:alt" content="' + articleImages[0].alt + '" />'];



  //put the images in the ogData
  var images = [];
  var articleImagesHttp;
  var articleImageDetails;

  for (i = 0; i < articleImages.length; i++) {
    articleImagesHttp = articleImages[i].src.replace('https', 'http'); //site forces ssl for connections, needed reggo url string for og:image tag
    images[i] = {
      httpsrc: '<meta property="og:image" content="' + articleImagesHttp + '" />',
      src: '<meta property="og:image:secure_url" content="' + articleImages[i].src + '" />',
      alt: '<meta property="og:image:alt" content="' + articleImages[i].alt + '" />'
    };

    //update variable to append to end of ogComplete string so og:image data shows up in correct order
    articleImageDetails += images[i].httpsrc + '\n' + images[i].src + '\n' + images[i].alt;

  }

  ogData.push(articleImageDetails);

  function readOgData(item, index) {
    ogComplete += item + '\n';
  }

  ogData.forEach(readOgData);

  ogComplete.toString();

  //remove commas and clean up string for copy/paste
  ogComplete = ogComplete.replace(/(\>\,\<)|(\>\<)/g, '\>\n\<').replace(/undefined/g, '');
  // console.log(ogComplete);
  copyTextToClipboard(ogComplete);
}
