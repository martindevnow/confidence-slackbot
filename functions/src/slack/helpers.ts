export const isContractor = (commandArg: string) => {
  // should be formatted as `/conf contractor-marc #`
  const regex = /contractor-\w+ [1-9]/i;

  return regex.test(commandArg);
};

export const getContractorName = (commandArg: string) => {
  const regex = /contractor-(\w+) [1-9]/i;
  const match = commandArg.match(regex);

  return match?.[1];
};
