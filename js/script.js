// 기존에 정상 작동하는 화면 진입 효과. 기능 추가 시 유지한다.
document.documentElement.classList.add('has-js');
const revealSections = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealSections.forEach((section) => observer.observe(section));
} else {
  revealSections.forEach((section) => section.classList.add('is-visible'));
}

const heroRate = document.querySelector('.hero-big-number');
if (heroRate) {
  const rateText = heroRate.firstChild;
  const prefersReducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || !window.requestAnimationFrame) {
    rateText.textContent = '4.2';
  } else {
    const duration = 1500;
    const startTime = performance.now();
    rateText.textContent = '0.0';

    const countUp = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      rateText.textContent = (4.2 * easedProgress).toFixed(1);

      if (progress < 1) {
        window.requestAnimationFrame(countUp);
      }
    };

    window.requestAnimationFrame(countUp);
  }
}

const comparison = document.querySelector('.unemployment-compare-section');
if (comparison) {
  const yearData = {
    a: {
      rate: '4.2',
      description: '연도 A의 실업률 4.2%를 보여주는 학습용 가상 데이터입니다.',
      image: 'images/year-a.svg',
      imageAlt: '가상 데이터 연도 A 실업률 추이 그래프',
      yearLabel: 'YEAR A',
      footerYear: '연도 A',
      status: '연도 A의 학습용 가상 데이터입니다.'
    },
    b: {
      rate: '3.6',
      description: '연도 B의 실업률 3.6%를 보여주는 학습용 가상 데이터입니다.',
      image: 'images/year-b.svg',
      imageAlt: '가상 데이터 연도 B 실업률 추이 그래프',
      yearLabel: 'YEAR B',
      footerYear: '연도 B',
      status: '연도 B의 학습용 가상 데이터입니다.'
    }
  };
  const buttons = {
    a: comparison.querySelector('.year-button-a'),
    b: comparison.querySelector('.year-button-b')
  };
  const rate = comparison.querySelector('.year-rate');
  const label = comparison.querySelector('.year-label');
  const title = comparison.querySelector('.metric-title');
  const description = comparison.querySelector('.year-description');
  const chart = comparison.querySelector('.year-chart');
  const footerYear = comparison.querySelector('.chart-year');
  const status = comparison.querySelector('.selection-status');
  let rateAnimationFrame = null;

  const animateRate = (target) => {
    if (rateAnimationFrame !== null && window.cancelAnimationFrame) {
      window.cancelAnimationFrame(rateAnimationFrame);
    }

    rateAnimationFrame = null;
    const prefersReducedMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !window.requestAnimationFrame) {
      rate.firstChild.textContent = target;
      return;
    }

    const duration = 1500;
    const startTime = performance.now();
    rate.firstChild.textContent = '0.0';

    const countUp = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      rate.firstChild.textContent = progress === 1
        ? target
        : (Number(target) * easedProgress).toFixed(1);

      if (progress < 1) {
        rateAnimationFrame = window.requestAnimationFrame(countUp);
      } else {
        rateAnimationFrame = null;
      }
    };

    rateAnimationFrame = window.requestAnimationFrame(countUp);
  };

  const selectYear = (year) => {
    const data = yearData[year];
    animateRate(data.rate);
    label.textContent = data.yearLabel;
    title.textContent = `연도 ${year.toUpperCase()}의 실업률 변화`;
    description.textContent = data.description;
    chart.src = data.image;
    chart.alt = data.imageAlt;
    footerYear.textContent = data.footerYear;
    status.textContent = data.status;

    Object.keys(buttons).forEach((key) => {
      const selected = key === year;
      buttons[key].classList.toggle('active', selected);
      buttons[key].setAttribute('aria-pressed', String(selected));
    });
  };

  buttons.a.addEventListener('click', () => selectYear('a'));
  buttons.b.addEventListener('click', () => selectYear('b'));
  selectYear('a');
}
