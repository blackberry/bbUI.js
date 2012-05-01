bb.textInput = {
    apply: function(elements) {
        if (bb.device.isBB5) {
            for (var i = 0; i < elements.length; i++) {
                var outerElement = elements[i];
            }
        } else if (bb.device.isBB10){
      var res,
        i,
        outerElement,
        css;

      if (bb.device.isPlayBook) {
        res = 'lowres';
      } else {
        res = 'hires';
      }
      for (i = 0; i < elements.length; i++) {
                outerElement = elements[i];
                css = '';
        // Keep the developers existing styling
        if (outerElement.hasAttribute('class')) {
          css = outerElement.getAttribute('class');
        }

        outerElement.normal = css + ' bb-bb10-input bb-bb10-input-'+res;
        outerElement.focused = css + ' bb-bb10-input-focused bb-bb10-input-focused-'+res+' bb-bb10-input-'+res;
                outerElement.setAttribute('class', outerElement.normal);
        outerElement.isFocused = false;
        outerElement.clickCount = 0;
        outerElement.addEventListener('focus', function() {
                              this.setAttribute('class',this.focused);
                              this.style['border-color'] = bb.options.bb10HighlightColor;
                              this.isFocused = true;
                              this.clickCount = 0;
                            }, false);

        outerElement.addEventListener('blur', function() {
                              this.setAttribute('class',this.normal);
                              this.style['border-color'] = '';
                              this.isFocused = false;
                              this.removeEventListener('click',outerElement.handleDeleteClick , false);
                            }, false);

        outerElement.addEventListener('click',function (event) {
                          // Don't handle the first click which is the focus
                          if (this.clickCount == 0) {
                            this.clickCount++;
                            return;
                          }
                          if (event.target == this && this.isFocused) {
                            var deleteClicked = false;
                            if (bb.device.isPlayBook && event.clientX > (this.clientWidth - 40)) {
                              deleteClicked = true;
                            } else if(event.clientX > (this.clientWidth - 45)){
                              deleteClicked = true;
                            }
                            if (deleteClicked) {
                              this.value = '';
                            }
                          }
                        } , false);
            }
    }else {
            for (var i = 0; i < elements.length; i++) {
                var outerElement = elements[i];
                var style = outerElement.getAttribute('class');
                style = style + ' bb-bb7-input';

                if (bb.device.isHiRes) {
                    style = style + ' bb-bb7-input-hires';
                } else {
                    style = style + ' bb-bb7-input-lowres';
                }
                // Apply our style
                outerElement.setAttribute('class', style);
            }
        }
    }
};
