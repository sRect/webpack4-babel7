const isMobile = () => { // detection PC and Mobile
  if (!!navigator.userAgent.match(/AppleWebKit.*Mobile.*/) && !!navigator.userAgent.match(/AppleWebKit/)) {
    // document.writeln('Browser:' + 'Mobile Browser' + '<hr>');
    return true;
  } else {
    // document.writeln('Browser:' + 'Desktop Browser' + '<hr>');
    return false;
  }
}

export {
  isMobile
}