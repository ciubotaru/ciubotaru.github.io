/** layout:
* input for merged file
* link for download
* button to clear input (active if merged not empty)
* input for merged file size (inactive, just showing)
* input for chunk size (inactive)
* increase/decrease buttons (active if merged file not empty)
* split button (active if merged file not empty)
----
* input 
...
**/
var file_whole = [];

var download_links = [];

const file_whole_input = document.getElementById("split_input");

file_whole_input.addEventListener("change", file_whole_input_changed);

function file_whole_input_changed() {
  file_whole = event.target.files;
  /** if smth was selected **/
  if (file_whole && file_whole.length != 0) {
    document.getElementById("split_input_clear").disabled = false;
    document.getElementById("split_btn").disabled = false;
    const download_link = create_url(file_whole[0], file_whole[0].name, file_whole);
    update_size(file_whole[0].size);
    update_chunk_nr(file_whole[0].size, document.getElementById("split_chunk_size").textContent);
    //enable split button
  }
  else {
    document.getElementById("split_input_clear").disabled = true;
    document.getElementById("split_btn").disabled = true;
    //delete dowload link
    update_size(0);
    update_chunk_nr(0, 0);
    //disable split btn
  }
};

const chunk_size = document.getElementById("split_chunk_size");
chunk_size.addEventListener("input", (event) => {
  update_chunk_nr(document.getElementById("split_input_size").textContent, document.getElementById("split_chunk_size").textContent);
});

function split_input_clear() {
  document.getElementById("split_input").value = "";
  file_whole_input_changed();
}

function create_url(blob, filename, id) {
  const url = URL.createObjectURL(blob);
  const download_link = document.createElement("a");
  download_link.href = url;
  download_link.id = id;
  download_link.download = filename;
  download_link.textContent = "Download " + filename;
  return download_link;
}

function update_size(size) {
  z = document.getElementById("split_input_size");
  z.textContent = size;
}

function update_chunk_size(size) {
  z = document.getElementById("split_chunk_size");
  z.textContent = size;
}

function chunk_resize(coef) {
  z = document.getElementById("split_chunk_size").textContent;
  z *= coef;
  update_chunk_size(z);
  update_chunk_nr(document.getElementById("split_input_size").textContent, document.getElementById("split_chunk_size").textContent);
}

function update_chunk_nr(total_size, chunk_size) {
  z = document.getElementById("split_chunk_nr");
  if (total_size == 0 || chunk_size == 0)
    z.textContent = 0;
  z.textContent = Math.ceil(total_size / chunk_size);
}

function download() {
  
}

function split() {
  file_slices = []; //cleanup
  var chunk_size = eval(document.getElementById("split_chunk_size").textContent);
  var start = 0;
  var current = 0;
  var end = file_whole[0].size;
  var index = 0;
  var parent = document.getElementById("download");
  while (start < end) {
//console.log("Pushing from " + start);
    current = start + chunk_size;
    const chunk = file_whole[0].slice(start, current);
    const chunk_name = file_whole[0].name + "." + index;
    const blob = new Blob([chunk]);
    const download_link = create_url(blob, chunk_name, "file_chunk_" + index);
    download_links.push(download_link);
    parent.appendChild(download_link);
    start = current;
    index++;
  }
  alert("IFS: " + file_whole[0].size + " OFS: " + chunk_size + " NR: " + download_links.length);
}
