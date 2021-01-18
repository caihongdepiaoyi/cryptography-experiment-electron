const { remote, ipcRenderer, shell } = require('electron');
const fs = require('fs')
const child_process = require('child_process');
const { worker } = require('cluster');

const mainProcess = remote.require('./main.js');
const filename = document.querySelector('#filename');
const openExplorer = document.querySelector("#open-explorer")
const openFileButton = document.querySelector('#open-file');
const open = document.querySelectorAll('#open-file');
const loadKey = document.querySelector('#load-key');
open.forEach((v, i, arr)=> {
    v.addEventListener('click', () => {
        mainProcess.getFileFromUser(i);
    })
})
const fileContent = document.querySelector('#file-Content');
const plainContent = document.querySelector('#plain-Content');
const beginDecrypt = document.querySelector('#begin-decrypt')
const startDecrypt = document.querySelector('#start-decrypt')
const status = document.querySelector('#status');
const max = document.querySelector('#max');
const min = document.querySelector('#min');
const close = document.getElementById('close');
const save = document.getElementById('save-file');
var path = "";
var contents = "";
var filenameNow = "";

ipcRenderer.on('file-opened', (event, file, content, num) => {
    console.log(num)
    console.log(content.length)
    contents = content;
    if(num == 0) {
        fileContent.value = content.length > 1000 ? content.slice(0, 1000) : content;
    }
    
    console.log(file)
    console.log(__dirname)
    filenameNow = file;
    filenames = file.split('\\')
    console.log(filenames[filenames.length - 1])
    console.log(filenames[filenames.length - 1].length)

    filename.textContent = "当前文件：".concat(filenames[filenames.length - 1].length <= 35 ? filenames[filenames.length - 1] : filenames[filenames.length - 1].slice(0, 35) + '...')
    filenames.pop();
    path = filenames
    if (file&&(num == 0)) {
        openExplorer.disabled = false;
    }
    if (contents&&(num == 0)) {
        beginDecrypt.disabled = false;
    }
    if (contents&&(num == 1)) {
        loadKey.disabled = false;
    }

    $("#status")[0].innerText = num == 0? "已打开明文":"已打开密文";
})

if (max) {
    max.addEventListener('click', () => {
        //发送最大化命令
        ipcRenderer.send('window-max');
        //最大化图形切换
        if (max.getAttribute('src') == 'images/max.png') {
            max.setAttribute('src', 'images/maxed.png');
        } else {
            max.setAttribute('src', 'images/max.png');
        }
    })
}

if (min) {
    min.addEventListener('click', () => {
        //发送最小化命令
        ipcRenderer.send('window-min');
    })
}

if (close) {
    close.addEventListener('click', () => {
        //发送关闭命令
        ipcRenderer.send('window-close');
    })
    close.addEventListener('mouseenter', () => {
        close.src = "images/close2.png"
    })
    close.addEventListener('mouseout', () => {
        close.src = "images/close.png"
    })
}

openExplorer.addEventListener("click", () => {
    // console.log(path.join('\\'))
    // console.log(path.join('\\'))
    shell.openPath(path.join('\\'))
})

save.addEventListener('click', () => {
    ipcRenderer.send('saveFile');
})

ipcRenderer.on('exportPath', (event, message) => {
    if (!message.canceled) {
        fs.copyFile("result\\Decode.Data", message.filePath, (err) => {
            if (err) {alert("目标文件已经存在")}
            else {
                alert("保存成功")
                plainContent.value = "";
                save.disabled = true;
            }
        })

    }

})

function runExec(cmdStr, num) {
    workerProcess = child_process.exec(cmdStr)
    workerProcess.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
    });

    // 打印错误的后台可执行程序输出
    workerProcess.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
    });

    // 退出之后的输出
    workerProcess.on('close', function (code) {
        console.log('out code：' + code);
        $("#msg").hide();
        $("#overlay").hide();
        $("#status")[0].innerText = num == 0?"加密完成":"解密完成";
        alert(num == 0?"加密完成":"解密完成")
        if(num == 1) {
            save.disabled = false
            fs.open("result\\Decode.Data", (res, fd) => {
                if(fd) {
                    const content = fs.readFileSync("result\\Decode.Data").toString();
                    plainContent.value = content.length > 1000 ? content.slice(0, 1000) : content;
                }
                
            })
            loadKey.disabled = true;
            startDecrypt.disabled = true;
        }else if(num == 0) {
            fileContent.value = ""
            beginDecrypt.disabled = true;
            openExplorer.disabled = true;
        }
    })
}

loadKey.addEventListener('click', (event) => {
    console.log("result\\public_key.pem")
    fs.access("result\\public_key.pem",fs.constants.F_OK, function(exist0) {
        fs.access("result\\private_key.pem", function(exist1) {
            if(exist0 || exist1) {
                console.log("err")
                alert("目录下缺少密钥文件")
            } else {
                console.log("ok")
                startDecrypt.disabled = false;
                $("#status")[0].innerText = "密钥加载完毕";
            }    
        })
    });
})

startDecrypt.addEventListener('click',(event) => {
    var pageHeight = window.screen.availHeight;
    var pageWidth = window.screen.availWidth;
    $("#overlay").height(pageHeight);
    $("#overlay").width(pageWidth);
    $("#overlay").fadeTo(200, 0.5);
    $("#status")[0].innerText = "解密中";
    $("#msg").show();
    cmdStr = "tools\\tool.exe d " + filenameNow + " result\\private_key.pem"
    console.log(path)
    runExec(cmdStr, 1)
})

//点击按钮弹出遮罩
$("#begin-decrypt").click(function () {
    var pageHeight = window.screen.availHeight;
    var pageWidth = window.screen.availWidth;
    $("#overlay").height(pageHeight);
    $("#overlay").width(pageWidth);
    // fadeTo第一个参数为速度，第二个为透明度
    // 多重方式控制透明度，保证兼容性，但也带来修改麻烦的问题
    $("#overlay").fadeTo(200, 0.5);
    $("#status")[0].innerText = "加密中";
    $("#msg").show();
    cmdStr = "tools\\tool.exe e " +  filenameNow
    console.log(cmdStr)
    runExec(cmdStr, 0)
});

