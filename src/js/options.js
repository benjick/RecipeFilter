function remove(site, e){
	browser.storage.sync.remove(site).then(function(){
		e.style.display = 'none';
	});
}
function parseHTML(str) {
    var tmp = document.implementation.createHTMLDocument();
    tmp.body.innerHTML = str;
    return tmp.body;
};
browser.storage.sync.get(null, function(data){
	for (site in data) {
		var row = `<tr>
			<td class="trash-cell" style="cursor:pointer;">&#9447;</td>
			<td>${site}</td>
		</tr>`;
		var element = parseHTML(row);
		document.getElementById('blacklist').querySelector('tbody').appendChild(element);
		element.addEventListener("click", () => remove(site, element));
	}
});