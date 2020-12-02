function tamingselect()
{
	if(!document.getElementById && !document.createTextNode){return;}

// Classes for the link and the visible dropdown
	var ts_selectclass='turnintodropdown'; 	// class to identify selects
	var ts_listclass='turnintoselect';		// class to identify ULs
	var ts_boxclass='dropcontainer'; 		// parent element
	var ts_triggeron='activetrigger'; 		// class for the active trigger link
	var ts_triggeroff='trigger';			// class for the inactive trigger link
	var ts_dropdownclosed='dropdownhidden'; // closed dropdown
	var ts_dropdownopen='dropdownvisible';	// open dropdown
	var full = false;
/*
	Turn all selects into DOM dropdowns
*/
	var count=0;
	var toreplace=new Array();
	var sels=document.getElementsByTagName('select');
	for(var i=0;i<sels.length;i++){
		if (ts_check(sels[i],ts_selectclass))
		{
			var hiddenfield=document.createElement('input');
			hiddenfield.name=sels[i].name;
			hiddenfield.type='hidden';
			hiddenfield.id=sels[i].id;
			hiddenfield.value=sels[i].options[0].value;
			sels[i].parentNode.insertBefore(hiddenfield,sels[i])
			var trigger=document.createElement('a');
			ts_addclass(trigger,ts_triggeroff);
			trigger.href='#';
			trigger.onclick=function(){
				ts_swapclass(this,ts_triggeroff,ts_triggeron)
				ts_swapclass(this.parentNode.getElementsByTagName('ul')[0],ts_dropdownclosed,ts_dropdownopen);
				return false;
			}
			trigger.appendChild(document.createTextNode(sels[i].options[0].text));
			sels[i].parentNode.insertBefore(trigger,sels[i]);
			var replaceUL=document.createElement('ul');
			for(var j=0;j<sels[i].getElementsByTagName('option').length;j++)
			{
				var newli=document.createElement('li');
				var newa=document.createElement('a');
				newli.v=sels[i].getElementsByTagName('option')[j].value;
				newli.elm=hiddenfield;
				newli.istrigger=trigger;
				newa.href='#';
				newa.appendChild(document.createTextNode(
				sels[i].getElementsByTagName('option')[j].text));
				newli.onclick=function(){ 
					this.elm.value=this.v;
					ts_swapclass(this.istrigger,ts_triggeron,ts_triggeroff);
					ts_swapclass(this.parentNode,ts_dropdownopen,ts_dropdownclosed)
					this.istrigger.firstChild.nodeValue=this.firstChild.firstChild.nodeValue;
					return false;
				}
				newli.appendChild(newa);
				replaceUL.appendChild(newli);
			}
			ts_addclass(replaceUL,ts_dropdownclosed);
			var div=document.createElement('div');
			div.appendChild(replaceUL);
			ts_addclass(div,ts_boxclass);
			sels[i].parentNode.insertBefore(div,sels[i])
			toreplace[count]=sels[i];
			count++;
		}
	}
	
/*
	Turn all ULs with the class defined above into dropdown navigations
*/	

	var uls=document.getElementsByTagName('ul');
	for(var i=0;i<uls.length;i++)
	{
		if(ts_check(uls[i],ts_listclass))
		{
			var newform=document.createElement('form');
			var newselect=document.createElement('select');
			for(j=0;j<uls[i].getElementsByTagName('a').length;j++)
			{
				var newopt=document.createElement('option');
				newopt.value=uls[i].getElementsByTagName('a')[j].href;	
				newopt.appendChild(document.createTextNode(uls[i].getElementsByTagName('a')[j].innerHTML));	
				newselect.appendChild(newopt);
			}
			newselect.onchange=function()
			{
				window.location=this.options[this.selectedIndex].value;
			}
			newform.appendChild(newselect);
			uls[i].parentNode.insertBefore(newform,uls[i]);
			toreplace[count]=uls[i];
			count++;
		}
	}
	for(i=0;i<count;i++){
		toreplace[i].parentNode.removeChild(toreplace[i]);
	}
	function ts_check(o,c)
	{
	 	return new RegExp('\\b'+c+'\\b').test(o.className);
	}
	function ts_swapclass(o,c1,c2)
	{
		var cn=o.className
		o.className=!ts_check(o,c1)?cn.replace(c2,c1):cn.replace(c1,c2);
	}
	function ts_addclass(o,c)
	{
		if(!ts_check(o,c)){o.className+=o.className==''?c:' '+c;}
	}
}


function uploadFiles(_this) {
	var form = $(document).find('#feedback-form');
	var inputs = $(_this).closest('fieldset').find("input[type='file']");
	var i = 1;

	if($(_this).closest('fieldset').attr('data-maxItem') > 1)
		i = $(_this).closest('fieldset').attr('data-maxItem');

	if(inputs.length == i){
		if ($(_this).attr('data-mark')) {
			$(_this).prev('mark').text($(_this).val());
		}
		else {
			$(_this).attr('data-mark', 'true');
			$(_this).parent('label').after('<div class="f-fb-cross-label" onclick="removeField(this)"></div>');
			$(_this).prev('mark').text($(_this).val());
		}
	}
	/*Если на странице полей input < 5*/
	else if(inputs.length < i){
		if ($(_this).attr('data-mark'))
			$(_this).prev('mark').text($(_this).val());

		else {
			$(_this).attr('data-mark', 'true');
			$(_this).parent('label').after('<div class="f-fb-cross-label" onclick="removeField(this)"></div>');
			$(_this).prev('mark').text($(_this).val());

			$(_this).parents('div.file-container').after(
					'<div class="file-container contented">' +
					'<label class="file_upload">' +
					'<span class="button f-fb-bkg-color">Файл</span>' +
					'<mark class = "upload-file-name">' + 'Выберите файл для загрузки' +
					'</mark>' +
					'<input type="file" data-mark="" onchange="uploadFiles(this)">' +
					'</label>' +
					'</div>'
			);
		}
	}
    name_increment(_this);
}
function removeField(_this){

	var form = $(document).find('#feedback-form');
	var cross = $(_this).closest('fieldset').find('div.f-fb-cross-label');
	var i = 1;

	if($(_this).closest('fieldset').attr('data-maxItem') > 1)
		i = $(_this).closest('fieldset').attr('data-maxItem');

	if(cross.length < i && cross.length > 0)
		$(_this).parent('.file-container').remove();

	else if(cross.length == i){
		$(_this).parents('.f-fb-upload-files').append(
				'<div class="file-container contented">' +
				'<label class="file_upload">' +
				'<span class="button f-fb-bkg-color">Файл</span>' +
				'<mark class = "upload-file-name">' + 'Выберите файл для загрузки' +
				'</mark>' +
				'<input type="file" data-mark="" onchange="uploadFiles(this)">' +
				'</label>' +
				'</div>');
		$(_this).parent('.file-container').remove();
	}
    name_increment(_this);
}
function name_increment(_this)
{
    var name = $(_this).closest('fieldset').find("input[type='file']").first().attr('name');
    $(_this).closest('fieldset').find("input[type='file']").each(function(i, el){
        $(el).attr('name', name.replace(/(item\d+_)(\d)/g, "$1" + (i + 1)));
    });
}
window.onload = function()
{
	tamingselect();
};


