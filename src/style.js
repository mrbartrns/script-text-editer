const successBanner = document.querySelector(".alert");
const closeBtn = document.querySelector(".close");
submitBtn.addEventListener("click", () => {
    if(isSaveSuccessed) {
        successBanner.classList.add("alert-active");
        isSaveSuccessed = false;
    }
});
closeBtn.addEventListener("click", () => {
    successBanner.classList.remove("alert-active");
})