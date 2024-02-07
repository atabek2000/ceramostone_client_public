export default (purchProduct, tranProducts) => {
  try {
    const remain_per = (
      (100 / Number(purchProduct)) *
      Number(
        tranProducts.length > 0
          ? tranProducts
              .map((prod) => prod.amount_product)
              .reduce((accumulator, currentValue) => accumulator + currentValue)
          : 0
      )
    ).toFixed(0);

    return remain_per > 100 ? 100 : remain_per;
  } catch (e) {
    return 0;
  }
};
