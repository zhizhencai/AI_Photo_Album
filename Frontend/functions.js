var flag;
// var rec;
flag = true;
function upLoadPhoto(){

    let file = document.getElementById('inputFile').files[0];
    let file_name = file.name;
    let file_type = file.type;
    let reader = new FileReader();

    reader.onload = function() {
        let arrayBuffer = this.result;
        let blob = new Blob([new Int8Array(arrayBuffer)], {
            type: file_type
        });
        let blobUrl = URL.createObjectURL(blob);

        $("#addPic").attr('src', blobUrl);
        $("#addContain").removeClass('hide');
        document.getElementById('addName').innerText = "File '" +file_name + "' successfully uploaded!";
        console.log(blob);

        let data = document.getElementById('inputFile').files[0];
        let xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                console.log(this.responseText);
            }
        });
        xhr.withCredentials = false;
        xhr.open("PUT", "https://gxd7xhoy86.execute-api.us-east-1.amazonaws.com/photo/upload/hw3photob2/"+data.name);
        console.log(data.name)
        
        xhr.setRequestHeader("Content-Type", "image/png");
        xhr.setRequestHeader("x-api-key","33DLAnLPOA7VU645xu0m65tnaZ8Csqm1AONHvz6e");
        xhr.send(data);
    };
    reader.readAsArrayBuffer(file);

}

function diaplayItem(src, file_name) {
    let $template = $(
       ` <div class="card col-md-4">
            <img class="card-img-top" src=${src}>
            <p class="card-text">${file_name}</p>
        </div>
        <br>`
    );
    $('#picContain').append($template);
    if ($('#albumContain').hasClass('hide')) {
        $('#albumContain').removeClass('hide');
    }
}




var apigClient = apigClientFactory.newClient({
    apiKey: "33DLAnLPOA7VU645xu0m65tnaZ8Csqm1AONHvz6e"
});
function searchPhoto() {
    $('#albumContain').addClass('hide');
    $('#addContain').addClass('hide');
    $('#picContain').empty();

    if (flag == false){
        console.log('asdfasdf');
    }
    let value_input = $('#searchValue');
    let search_sentence = value_input.val();
    if(search_sentence.search("show me") === -1){
        search_sentence =  "give me " + search_sentence;
    }
    value_input.val('');
    console.log(search_sentence);

    if (flag == false) {

        let params ={
            q: 'use_voice',
        };
        console.log(params)
        apigClient.searchGet(params, {}, {}).then((res)=>{
                console.log(res);
        // todo use display item function here to create new pictures
        let body = res['data'];
        if(JSON.stringify(body) === '{}'){
            alert(`There is not image matches your search!`)
        }
        for(let key in body) {
          let test_src = body[key];
          let test_name = key;
          console.log(key);
          diaplayItem(test_src, test_name);
            }

        }
        ).catch((e)=>{
            console.log('something goes wrong');
        })




    } else {


        let params ={
            q: search_sentence,
        };
        console.log(params);
        // var rrr = apigClient.searchGet(params, {}, {});
        // console.log(rrr);
        apigClient.searchGet(params, {}, {}).then((res)=>{
                console.log(res);
        // todo use display item function here to create new pictures
        let body = res['data'];
        console.log('LOOK', res)

        if(JSON.stringify(body) === '{}'){
            alert(`There is not image matches your search!`)
        }
        for(let key in body) {
          let test_src = body[key];
          let test_name = key;
          console.log(key);
          diaplayItem(test_src, test_name);
            }

        }
        ).catch((e)=>{
            console.log('something goes wrong');
        })






    }






}


window.onload = function(){ 
  document.getElementById("record");
  document.getElementById("stopRecord");
  
  navigator.mediaDevices.getUserMedia({audio:true})
    .then(stream => {handlerFunction(stream)})


          function handlerFunction(stream) {
            // var options = {
            //     audioBitsPerSecond : 30000
            //   }
          console.log(stream);
          rec = new MediaRecorder(stream);
          console.log(rec);
          rec.ondataavailable = e => {
            audioChunks.push(e.data);
            console.log(audioChunks);
            if (rec.state == "inactive"){
              const blob = new Blob(audioChunks,{type: 'audio/wav'});
              console.log(audioChunks);
              console.log(blob);
              recordedAudio.src = URL.createObjectURL(blob);
              recordedAudio.controls=true;
              recordedAudio.autoplay=true;
              sendData(blob)

              let data = blob//document.getElementById('inputFile').files[0];
              let xhr = new XMLHttpRequest();
              xhr.withCredentials = true;
              xhr.addEventListener("readystatechange", function () {
                  if (this.readyState === 4) {
                      console.log(this.responseText);
                  }
              });
              xhr.withCredentials = false;
              xhr.open("PUT", "https://gxd7xhoy86.execute-api.us-east-1.amazonaws.com/photo/upload/hw3-voice/"+data.name +'1'+ '.wav');
              xhr.setRequestHeader("Content-Type", data.type);
              xhr.send(data);

            }
          }
        }
              function sendData(data) {}

      record.onclick = e => {
        console.log('I was clicked')
        record.disabled = true;
        record.style.backgroundColor = "blue"
        stopRecord.disabled=false;
        audioChunks = [];
        rec.start();
      }
      stopRecord.onclick = e => {
        console.log("I was clicked")
        alert('Currently processing your voice query; please press the search button')
        record.disabled = false;
        stop.disabled=true;
        record.style.backgroundColor = "black"
        flag = false; 
        rec.stop();
      }
} 
