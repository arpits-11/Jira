
const tabButtons = document.querySelectorAll('.main2 button');

const tabContent = {
  software: {
    heading: "Focus on outcomes, not admin",
    description: "Plan, track, and release world-class software with Jira's powerful agile tools.",
    image: "https://dam-cdn.atl.orangelogic.com/AssetLink/3m35263c8gy137p68p2v33ijxb0703p5.webp"
  },
  operations: {
    heading: "Conquer complex workflows",
    description: "Streamline operations and keep your business running smoothly with Jira.",
    image: "https://dam-cdn.atl.orangelogic.com/AssetLink/8mbx11md7br33n86667to5e4q87x8dfl.webp"
  },
  hr: {
    heading: "Build teamwork and productivity across your organization with Jira",
    description: "Manage hiring, onboarding, and employee requests all in one place.",
    image: "https://dam-cdn.atl.orangelogic.com/AssetLink/o3vf21711xl7j3k661enul0050252c02.webp"
  },
  allteams: {
    heading: "Where your teams and AI come together",
    description: "One platform for every team — from engineering to marketing and beyond.",
    image: "https://dam-cdn.atl.orangelogic.com/AssetLink/wdmncs35471g5521yr5462w3ku0t834b.webp"
  },
  marketing: {
    heading: "Go from big idea to an even bigger launch",
    description: "Launch campaigns faster and keep creative projects on track.",
    image: "https://dam-cdn.atl.orangelogic.com/AssetLink/ox58yay38c0ps0rm5xeg0e2765128to3.webp"
  },
  designs: {
    heading: "Design with all the right context",
    description: "Manage design projects, feedback, and handoffs seamlessly.",
    image: "https://dam-cdn.atl.orangelogic.com/AssetLink/2s7dw8mxw65kwtjh2npm8x55200kcnu3.webp"
  },
  sales: {
    heading: "Hit sales team targets with Jira",
    description: "Track deals, manage pipelines, and close more with Jira.",
    image: "https://dam-cdn.atl.orangelogic.com/AssetLink/87h6hy3p184v1kyn202mov58b5y6q82d.webp"
  }
};

const tabKeys = ['software', 'operations', 'hr', 'allteams', 'marketing', 'designs', 'sales'];

const heroHeading = document.querySelector('.h1');
const heroImage = document.querySelector('.pic img');

tabButtons.forEach((btn, index) => {
  btn.addEventListener('click', () => {

    tabButtons.forEach(b => {
      b.style.backgroundColor = '';
      b.style.borderRadius = '25px';
    });

    btn.style.backgroundColor = '#cfe1fd';
    btn.style.borderRadius = '25px';

    const key = tabKeys[index];
    const content = tabContent[key];

    heroHeading.style.opacity = '0';
    heroImage.style.opacity = '0';

    setTimeout(() => {
      heroHeading.textContent = content.heading;
      heroImage.src = content.image;
      heroImage.style.opacity = '1';
      heroHeading.style.opacity = '1';
    }, 200);

  });
});

heroHeading.style.transition = 'opacity 0.2s ease';
heroImage.style.transition = 'opacity 0.2s ease';

const featureBtns = document.querySelectorAll('.bt11, .bt12, .bt13, .bt14');
const featurePanels = document.querySelectorAll('.tab-panel');

featurePanels.forEach((panel, i) => {
  panel.style.display = i === 0 ? 'block' : 'none';
});

if (featureBtns[0]) {
  featureBtns[0].style.backgroundColor = '#cfe1fd';
  featureBtns[0].style.color = '#1C2B42';
}

featureBtns.forEach((btn, index) => {
  btn.addEventListener('click', () => {

    featureBtns.forEach(b => {
      b.style.backgroundColor = '#FFFFFF';
      b.style.color = '#6b778c';
    });

    btn.style.backgroundColor = '#cfe1fd';
    btn.style.color = '#1C2B42';

    featurePanels.forEach(panel => {
      panel.style.opacity = '0';
      setTimeout(() => { panel.style.display = 'none'; }, 200);
    });

    setTimeout(() => {
      featurePanels[index].style.display = 'block';
      setTimeout(() => { featurePanels[index].style.opacity = '1'; }, 10);
    }, 200);

  });
});

featurePanels.forEach(panel => {
  panel.style.transition = 'opacity 0.2s ease';
});