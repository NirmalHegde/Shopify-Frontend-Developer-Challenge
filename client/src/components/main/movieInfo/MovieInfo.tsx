import React from 'react';
// import { Button } from '@shopify/polaris'

const MovieInfo = (): JSX.Element => {
  // const [active, setActive] = useState(true)

  // const handleChange = useCallback(() => setActive(!active), [active])

  // const handleScrollBottom = useCallback(() => alert('Scrolled to bottom'), [])

  // const activator = <Button onClick={handleChange}>Open</Button>

  return (
    <div style={{ height: '500px' }}>
      {/* <Modal
        activator={activator}
        open={active}
        title="Scrollable content"
        onClose={handleChange}
        onScrolledToBottom={handleScrollBottom}
      >
        {Array.from({ length: 50 }, (_, index) => (
          <Modal.Section key={index}>
            <TextContainer>
              <p>
                Item
                {' '}
                <a href="#">
                  #
                  {index}
                </a>
              </p>
            </TextContainer>
          </Modal.Section>
        ))}
      </Modal> */}
    </div>
  );
};

export default MovieInfo;
