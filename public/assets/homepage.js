window.onload= function load(){
    const btn = document.getElementsByClassName('btn'),
  banner = document.getElementById('banner');
  desc=document.getElementById('desc');
  head=document.getElementById('head');

btn[0].onclick = function () {
  banner.src ="https://d3e3a9wpte0df0.cloudfront.net/wp-content/uploads/2020/08/Role-models-for-educational-platforms.jpg";
  head.innerHTML="Welcome<br> To CourseExpert";
  desc.innerHTML="A Library of MOOC Courses from Multiple Platforms";
  animation();
  this.classList.add('active');
};

btn[1].onclick = function () {
  banner.src ="https://cdn.classpert.com/assets/media/svg/technologies-7fe33ceb059980dc8a2be30015f63061.svg";
  head.innerHTML="Explore<br> 10000+ Courses";
  desc.innerHTML="Across Various Topics and Providers";
  animation();
  this.classList.add('active');
};

btn[2].onclick = function () {
  banner.src ="https://www.feedbackexpress.com/wp-content/uploads/2018/05/amazon-product-reviews-guide.jpg";
  head.innerHTML="Everything MOOC At Once";
  desc.innerHTML="Compare and Discuss Courses, Read Reviews and Much More"
  animation();
  this.classList.add('active');
};

function animation() {
  banner.classList.add('zoom');
  setTimeout(function () {
    banner.classList.remove('zoom');
  }, 500);

  for (b of btn) {
    b.classList.remove('active');
  }
}};
