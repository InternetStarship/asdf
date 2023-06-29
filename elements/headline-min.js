const headline=(e,t="headline",n="headlinePrepend",i="fa_prepended")=>{const a=e.element;const r=blueprint("Headline/V1",e.id,e.parentId,e.index,a),l=app.makeId(),o=properties.css(a.id,t);let s=headlinePageTree(a.content.json,l),d=o["font-weight"],p="";if(/<\/?[a-z][\s\S]*>/i.test(a.content.html)){if(document.querySelector(`#${a.id} .elHeadline b`)&&document.querySelector(`style#bold_style_${a.id}`)){p=document.querySelector(`style#bold_style_${a.id}`).textContent.split("color:")[1].replace(";","").replace("}","").trim()}}else{const e=app.makeId();s=[{type:"text",innerText:a.content.text,id:e,version:0,parentId:l,fractionalIndex:"a0"}]}const c=properties.borderRadius(a.css);"normal"===d?d="400":"bold"===d?d="700":"bolder"===d?d="900":"lighter"===d&&(d="200");const g=properties.css(a.id,n),f=document.querySelector(`#${a.id} .${i}`);let m={};return f&&(m={attrs:{"data-skip-icon-settings":"false",className:f.getAttribute("class").replace(`${i} `,""),style:{"margin-left":parseInt(g["margin-left"])||0,"margin-right":parseInt(g["margin-right"])||0,"font-size":parseInt(g["font-size"])||0,color:g.color,width:"auto"}},params:{"margin-left--unit":"px","margin-right--unit":"px","font-size--unit":"px"}}),s=s.filter((function(e){return void 0!==e})),r.params="image_list_headline"!==t?params(o,"element",a.id):{},r.attrs={style:{"margin-top":parseInt(a.css["margin-top"])||0,"padding-top":parseInt(o["padding-top"])||0,"padding-bottom":parseInt(o["padding-bottom"])||0,"padding-left":parseInt(o["padding-left"])||0,"padding-right":parseInt(o["padding-right"])||0,position:o.position||"relative","z-index":parseInt(o["z-index"])||0},"data-skip-background-settings":"false"},r.selectors={".elHeadline":{attrs:{style:{"font-family":o["font-family"],"font-weight":d,"letter-spacing":o["letter-spacing"]||0,"line-height":o["line-height"]||0,"font-size":parseInt(o["font-size"])||26,color:o.color,"text-transform":o["text-transform"],"text-decoration":o["text-decoration"],"text-align":o["text-align"],opacity:parseInt(o.opacity)||1}},".elHeadline b,\\n.elHeadline strong":{attrs:{style:{color:p||o.color}}}},".elHeadline b,\\n.elHeadline strong":{attrs:{style:{color:p||o.color}}},".fa_prepended":m},r.children=[{type:"ContentEditableNode",attrs:{"data-align-selector":".elHeadline"},id:l,version:0,parentId:e.id,fractionalIndex:"a0",children:s}],a.content.visible&&(r.attrs["data-show-only"]=a.content.visible),r.attrs.style=Object.assign(r.attrs.style,c),r};function headlinePageTree(e,t){let n=[];return e?(e.forEach(((e,i)=>{const a=app.makeId(),r="a"+(i+1).toString(36);let l={...e,id:a,version:0,parentId:t,fractionalIndex:r};e.children&&(l.children=headlinePageTree(e.children,a)),n.push(l)})),n):n}