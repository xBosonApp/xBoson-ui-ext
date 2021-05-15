const renderAccess = () => (
  <Form.Item label="" style={props.showTarget ? { display: 'none' } : {}}>
    {getFieldDecorator('targetId', {
      rules: [{ required: true }],
      initialValue: props.target.id ? props.target.name : '',
    })(
      <Select mode="multiple" disabled={!!props.target.id}>
        {Array.from(new Set<string>(dimensionList.filter((item: any) => item.typeName).map((item: any) => item.typeName))).map(
          type => {
            const typeData = groupBy(dimensionList, item => item.typeName)[type];
            return (
              <Select.OptGroup label={type} key={type}>
                {typeData.map((e: any) => (
                  <Select.Option value={e.id} key={e.id}>
                    {e.name}
                  </Select.Option>
                ))}
              </Select.OptGroup>
            );
          },
        )}
      </Select>,
    )}
  </Form.Item>);