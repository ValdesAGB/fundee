export const formatCurrency = (amount: any) => {
  return `${new Intl.NumberFormat("fr-FR").format(amount)} `;
};
