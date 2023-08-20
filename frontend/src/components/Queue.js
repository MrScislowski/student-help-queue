import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #8d94ba;
  padding: 10px;
  border-radius: 10px;
`;

const QueueItem = styled.div`
  background-color: #a0cfd3;
  border-radius: 5px;
  padding: 10px;
  margin: 10px;
`;

const ResolveButton = styled.button`
  background-color: rgb(233, 246, 233);
  border: none;
  border-radius: 5px;
`;

const CancelButton = styled.button`
  background-color: rgb(255, 241, 223);
  border: none;
  border-radius: 5px;
`;

const Queue = (props) => {
  const { entries, resolveEntryMutation, getEntryAge } = props;

  return (
    <Container>
      {entries.data.map((item) => {
        return (
          <QueueItem key={item.request.user.email}>
            {item.request.user.givenName} {item.request.user.familyName} (
            {getEntryAge(item.request.timestamp)})
            <ResolveButton
              onClick={async () => {
                await resolveEntryMutation.mutate({
                  entry: item,
                  resolutionStatus: "resolve",
                });
              }}
            >
              Resolve
            </ResolveButton>
            <CancelButton
              onClick={async () => {
                await resolveEntryMutation.mutate({
                  entry: item,
                  resolutionStatus: "cancel",
                });
              }}
            >
              Cancel
            </CancelButton>
          </QueueItem>
        );
      })}
    </Container>
  );
};

export default Queue;
