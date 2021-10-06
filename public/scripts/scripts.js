// Controlling the navbar when page gets too narrow
const toggleButton = document.getElementsByClassName("toggle-button")[0];
const mobileMenu = document.getElementsByClassName("mobile-nav")[0];

toggleButton.addEventListener("click", () => {
	mobileMenu.classList.toggle("active");
});

window.addEventListener("resize", () => {
	if (window.matchMedia("(min-width: 600px)").matches) {
		mobileMenu.classList.remove("active");
	}
});

// Controlling game info and how to

function openInfoTab(tabname, tabid) {
	var infoContainers = document.getElementsByClassName("info");
	for (var i = 0; i < infoContainers.length; i++) {
		infoContainers[i].style.display = "none";
	}

	var tabs = document.getElementsByClassName("tab");
	var info = document.getElementsByClassName("info");

	for (var i = 0; i < tabs.length; i++) {
		tabs[i].classList.remove("active");
		//info[i].classList.remove("active");
	}
	document.getElementById(tabname).style.display = "block";
	//document.getElementById(tabname).classList.toggle("active");
	document.getElementById(tabid).classList.toggle("active");
}

// controlling arrow functions

const arrowIcon = document.getElementsByClassName("arrow-icon")[0];

arrowIcon.addEventListener("click", () => {
	window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
});
