function copyServerIP() {
    const serverIP = "mc.mistmc.top"; // 要复制的服务器IP文本
    navigator.clipboard.writeText(serverIP).then(() => {
        showCustomAlert("服务器IP已复制: " + serverIP);
    }).catch(err => {
        console.error("复制失败: ", err);
    });
}

function showCustomAlert(message) {
    const alertBox = document.getElementById("custom-alert");
    alertBox.textContent = message;
    alertBox.style.display = "block";
    alertBox.style.opacity = 1;

    // 1秒后隐藏提示框
    setTimeout(() => {
        alertBox.style.opacity = 0;
        setTimeout(() => {
            alertBox.style.display = "none";
        }, 500); // 等待动画结束后再隐藏
    }, 1000);
}