import React from "react";

const Token = ({ poolDetails }) => {
  return (
    <div className="section">
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-10 offset-md-1 col-lg-6 offset-lg-3">
            <div className="section__title">
              <h2>Token</h2>
              <p>More features with own Token.</p>
            </div>
          </div>
        </div>

        <div className="row row--relative">
          <div className="col-12">
            <div className="invest invest--big">
              <h2 className="invest__title">Token</h2>
              <div className="row">
                <div className="col-12 col-lg-5">
                  <div className="invest__rate-wrap">
                    <div className="invest__rate">
                      <span>Stake Supply</span>
                      <p>
                        {poolDetails?.depositToken.totalSupply}{" "}
                        {poolDetails?.depositToken.symbol}
                      </p>
                    </div>
                    <div className="invest__green">
                      <img src="img/graph/graph2.svg" alt="" />
                    </div>
                  </div>
                </div>

                <div className="col-12 col-lg-5 offset-lg-1">
                  <div className="invest__rate-wrap">
                    <div className="invest__rate">
                      <span>Total Stake</span>
                      <p className="green">
                        {poolDetails?.depositToken.contractTokenBalance.slice(0, 10)}
                        {poolDetails?.depositToken.symbol}
                      </p>
                    </div>

                    <div className="invest__graph">
                      <img src="img/graph/graph1.svg" alt="" />
                    </div>
                  </div>
                </div>

                <div className="col-12 col-lg-5">
                  <div className="invest__rate-wrap">
                    <div className="invest__rate">
                      <span>Reward Token</span>
                      <p className="red">
                        {poolDetails?.rewardToken.totalSupply}
                        {poolDetails?.rewardToken.symbol}
                      </p>
                    </div>

                    <div className="invest__graph">
                      <img src="img/graph/graph3.svg" alt="" />
                    </div>
                  </div>
                </div>

                <div className="col-12 col-lg-5 offset-lg-1">
                  <div className="invest__rate-wrap">
                    <div className="invest__rate">
                      <span>Price</span>
                      <p className="green">1 TBC = 0.00001 ETH</p>
                    </div>

                    <div className="invest__graph">
                      <img src="img/graph/graph4.svg" alt="" />
                    </div>
                  </div>
                </div>
              </div>
              <p className="invest__info">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                When an unknown printer took a galley of type and scrambled it to make a type
                specimen book. It has survived not only five centuries, but also the leap into
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Token;
