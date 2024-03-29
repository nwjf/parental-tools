/**
 * 生成数据配置
 */

import { Row, Col, Input, Button, message } from 'antd';
import MenuItem from '../../../../components/menuItem';
import { useState, useCallback } from 'react';

import Select from '../../../../components/adapter/select';

import { CreateDataConfig } from './index.d';
import { OPERATION_TYPE_LIST } from '../../constants';

import { useGetOperationConfigState, useSetOperationConfigState } from '../../atoms/operationConfigState';

const random = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min) + min);
};

export default function CreateConfig() {
  const operationConfigState = useGetOperationConfigState();
  const { setOperationData } = useSetOperationConfigState();

  const [createDataConfig, setCreateDataConfig] = useState({
    aMin: 0,
    aMax: 100,
    bMin: 0,
    bMax: 100,
    cMin: null,
    cMax: null,
    opertionType: '+',
    createTotal: 30,
    carry: 'r', // 进位/退位 , 随机 y/n/r
  });

  const optionsList = [
    { label: 0, value: 0 },
    { label: 1, value: 1 },
    { label: 2, value: 2 },
    { label: 3, value: 3 },
    { label: 4, value: 4 },
    { label: 5, value: 5 },
    { label: 6, value: 6 },
    { label: 7, value: 7 },
    { label: 8, value: 8 },
    { label: 9, value: 9 },
    { label: 10, value: 10 },
    { label: 20, value: 20 },
    { label: 30, value: 30 },
    { label: 40, value: 40 },
    { label: 50, value: 50 },
    { label: 60, value: 60 },
    { label: 70, value: 70 },
    { label: 80, value: 80 },
    { label: 90, value: 90 },
    { label: 100, value: 100 },
    { label: 150, value: 150 },
    { label: 200, value: 200 },
  ];

  const noList = [
    { label: '不设限制', value: null },
  ];

  const carryList = [
    { label: '加法进位/减法退位', value: 'y' },
    { label: '不进位/不退位', value: 'n' },
    { label: '随机', value: 'r' },
  ];

  const onValueChange = useCallback((data: any, key: string) => {
    setCreateDataConfig((d) => {
      return {
        ...d,
        [key]: data,
      }
    })
  }, [setCreateDataConfig]);

  // 创建
  const onCreate = useCallback(() => {
    const {
      aMin,
      aMax,
      bMin,
      bMax,
      cMin,
      cMax,
      opertionType,
      createTotal,
      carry,
    } = createDataConfig;
    // let opertionType = _opertionType;
    let list: Array<any> = [];

    let forNum = 0;
    for (;;) {
      // 防止内存超出
      forNum++;
      if (forNum / createTotal > 20) {
        message.error('条件可能超出，生成数据失败，请调整后再次尝试');
        return;
      }
      let a = random(aMin, aMax);
      let b = random(bMin, bMax);
      let c = random(cMin || 0, cMax || 100);
      let d = null;
      let temp: any = { a, b, c };

      // 加法(A+B=C)
      if (opertionType === '+') {
        temp.c = c = a + b;
        temp.str = `${a} + ${b} = ${c}`;
        temp.arr = [a, '+', b, '=', c];
        temp.answer = c;
      }
      // 减法(A-B=C)
      else if (opertionType === '-') {
        temp.c = c = a - b;
        temp.str = `${a} - ${b} = ${c}`;
        temp.arr = [a, '-', b, '=', c];
        temp.answer = c;
        if (a < b) continue;
      }
      // 乘法(AxB=C)
      else if (opertionType === '*') {
        temp.c = c = a * b;
        temp.str = `${a} x ${b} = ${c}`;
        temp.arr = [a, 'x', b, '=', c];
        temp.answer = c;
      }
      // 除法(C÷A=B)
      else if (opertionType === '/') {
        temp.c = c = a * b;
        temp.str = `${c} ÷ ${a} = ${b}`;
        temp.arr = [c, '÷', a, '=', b];
        temp.answer = b;
      }
      // *混合(A±B=C)
      else if (opertionType === '+-') {
        const opertionSymbol = random(0, 200) % 2 === 0 ? '+' : '-';
        if (opertionSymbol === '+') temp.c = c = a + b;
        else temp.c = c = a - b;
        temp.str = `${a} ${opertionSymbol} ${b} = ${c}`;
        temp.arr = [a, opertionSymbol, b, '=', c];
        temp.answer = c;
      }
      // *混合(AxB=C/C÷A=B)
      else if (opertionType === '*/') {
        const opertionSymbol = random(0, 200) % 2 === 0 ? 'x' : '÷';
        temp.c = c = a * b;
        if (opertionSymbol === 'x') {
          temp.str = `${a} ${opertionSymbol} ${b} = ${c}`;
          temp.arr = [a, opertionSymbol, b, '=', c];
          temp.answer = c;
        } else {
          temp.str = `${c} ${opertionSymbol} ${a} = ${b}`;
          temp.arr = [c, opertionSymbol, a, '=', b];
          temp.answer = b;
        }
      }
      // *混合(AxB±C=D)
      else if (opertionType === '*+-') {
        const opertionSymbol = random(0, 200) % 2 === 0 ? '+' : '-';
        if (opertionSymbol === '+') {
          temp.d = d = a * b + c;
        } else {
          temp.d = d = a * b - c;
        }
        temp.str = `${a} x ${b} ${opertionSymbol} ${c} = ${d}`;
        temp.arr = [a, 'x', b, opertionSymbol, c, '=', d];
        temp.answer = d;
      }
      // *混合(A÷B±C=D)
      else if (opertionType === '/+-') {
        const opertionSymbol = random(0, 200) % 2 === 0 ? '+' : '-';
        if (opertionSymbol === '+') {
          temp.d = d = a / b + c;
        } else {
          temp.d = d = a / b - c;
        }
        temp.str = `${a} ÷ ${b} ${opertionSymbol} ${c} = ${d}`;
        temp.arr = [a, '÷', b, opertionSymbol, c, '=', d];
        temp.answer = d;
      }
      
      // 判断c限制
      if ((cMin !== null && c < cMin) || (cMax !== null && c > cMax) || c < 0) {
        continue;
      }

      // 进位/退位
      if (carry === 'y' && (opertionType === '+' || opertionType === '-')) {
        const aStr = a.toString();
        const cStr = c.toString();
        if (aStr.length === cStr.length && aStr[0] === cStr[0]) {
          continue;
        }
      }
      // 不进/不退
      if (carry === 'n' && (opertionType === '+' || opertionType === '-')) {
        const aStr = a.toString();
        const cStr = c.toString();
        if (aStr.length !== cStr.length || aStr[0] !== cStr[0]) {
          continue;
        }
      }

      // 去重
      if (list.indexOf((item: any) => item.str === temp.str) >= 0) {
        continue;
      }
     

      list.push(temp);

      if (list.length >= createTotal) {
        break;
      }
    }
    
    // 排序
    list = list.sort((a, b) => a.a - b.a);

    setOperationData([...operationConfigState.data, ...list]);
  }, [createDataConfig, operationConfigState.data]);

  const onCleanData = () => {
    setOperationData([]);
  };

  return (
    <div className="create-config-operation-warp">
      <Row gutter={20}>
        <Col span={12}>
          <MenuItem name="数据A MIN">
            <Select
              style={{width: '100%'}}
              value={createDataConfig.aMin}
              options={optionsList}
              onChange={(d) => onValueChange(d, 'aMin')} />
          </MenuItem>
        </Col>
        <Col span={12}>
          <MenuItem name="数据A MAX">
            <Select
              style={{width: '100%'}}
              value={createDataConfig.aMax}
              options={optionsList}
              onChange={(d) => onValueChange(d, 'aMax')} />
          </MenuItem>
        </Col>
      </Row>

      <Row gutter={20}>
        <Col span={12}>
          <MenuItem name="数据B MIN">
            <Select
              style={{width: '100%'}}
              value={createDataConfig.bMin}
              options={optionsList}
              onChange={(d) => onValueChange(d, 'bMin')} />
          </MenuItem>
        </Col>
        <Col span={12}>
          <MenuItem name="数据B MAX">
            <Select
              style={{width: '100%'}}
              value={createDataConfig.bMax}
              options={optionsList}
              onChange={(d) => onValueChange(d, 'bMax')} />
          </MenuItem>
        </Col>
      </Row>

      <Row gutter={20}>
        <Col span={12}>
          <MenuItem name="数据C MIN">
            <Select
              style={{width: '100%'}}
              value={createDataConfig.cMin}
              options={[...noList, ...optionsList]}
              onChange={(d) => onValueChange(d, 'cMin')} />
          </MenuItem>
        </Col>
        <Col span={12}>
          <MenuItem name="数据C MAX">
            <Select
              style={{width: '100%'}}
              value={createDataConfig.cMax}
              options={[...noList, ...optionsList]}
              onChange={(d) => onValueChange(d, 'cMax')} />
          </MenuItem>
        </Col>
      </Row>

      <Row gutter={20}>
        <Col span={24}>
          <MenuItem name="运算类型">
            <Select
              style={{width: '100%'}}
              value={createDataConfig.opertionType}
              options={OPERATION_TYPE_LIST}
              onChange={(d) => onValueChange(d, 'opertionType')} />
          </MenuItem>
        </Col>
      </Row>

      <Row gutter={20}>
        <Col span={12}>
          <MenuItem name="进位(+)/退位(-)">
            <Select
              style={{width: '100%'}}
              value={createDataConfig.carry}
              options={carryList}
              onChange={(d) => onValueChange(d, 'carry')} />
          </MenuItem>
        </Col>
        <Col span={12}>
          <MenuItem name="生成数量">
            <Select
              style={{width: '100%'}}
              value={createDataConfig.createTotal}
              options={optionsList}
              onChange={(d) => onValueChange(d, 'createTotal')} />
          </MenuItem>
        </Col>
      </Row>

      <Row gutter={20}>
        <Col span={12}>
          <MenuItem name="操作">
            <Button
              style={{width: '100%'}}
              className="test"
              onClick={onCleanData}
              type="dashed"
              danger>清除所有数据</Button>
          </MenuItem>
        </Col>
        <Col span={12}>
          <MenuItem name="运算">
            <Button
              style={{width: '100%'}}
              className="test"
              onClick={onCreate}
              type="primary">创建运算题</Button>
          </MenuItem>
        </Col>
      </Row>
    </div>
  );
}