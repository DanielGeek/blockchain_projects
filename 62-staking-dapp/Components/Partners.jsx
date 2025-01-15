import React from "react";

const Partners = () => {
  const partners = [
    {
      name: "linkedin.com/in/daniel-angel-web3/",
      image: "img/partners/logo1.svg",
      url: "https://github.com/DanielGeek",
    },
    {
      name: "linkedin.com/in/daniel-angel-web3/",
      image: "img/partners/logo2.svg",
      url: "https://github.com/DanielGeek",
    },
    {
      name: "linkedin.com/in/daniel-angel-web3/",
      image: "img/partners/logo3.svg",
      url: "https://github.com/DanielGeek",
    },
    {
      name: "linkedin.com/in/daniel-angel-web3/",
      image: "img/partners/logo4.svg",
      url: "https://github.com/DanielGeek",
    },
    {
      name: "linkedin.com/in/daniel-angel-web3/",
      image: "img/partners/logo5.svg",
      url: "https://github.com/DanielGeek",
    },
    {
      name: "linkedin.com/in/daniel-angel-web3/",
      image: "img/partners/logo6.svg",
      url: "https://github.com/DanielGeek",
    },
    {
      name: "linkedin.com/in/daniel-angel-web3/",
      image: "img/partners/logo7.svg",
      url: "https://github.com/DanielGeek",
    },
    {
      name: "linkedin.com/in/daniel-angel-web3/",
      image: "img/partners/logo8.svg",
      url: "https://github.com/DanielGeek",
    },
  ];

  return (
    <section id="partners" className="section">
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3 col-xl-8 offset-xl-2">
            <div className="section__title">
              <h2>Our Partners</h2>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s
              </p>
            </div>
          </div>
        </div>

        <div className="row">
          {
            partners.map((partner, index) => (
              <div key={index} className="col-6 col-lg-3">
                <a href={partner.url} className="partner">
                  <img src={partner.image} alt="" />
                  <p>{partner.name}</p>
                </a>
              </div>
            ))
          }
        </div>
      </div>
    </section>
  );
};

export default Partners;
