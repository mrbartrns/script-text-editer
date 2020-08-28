const successBanner = document.querySelector(".alert");
const closeBtn = document.querySelector(".close");
submitBtn.addEventListener("click", () => {
    successBanner.classList.add("alert-active");
});
closeBtn.addEventListener("click", () => {
    successBanner.classList.remove("alert-active");
})