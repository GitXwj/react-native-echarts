import echarts from './echarts.min';
import toString from '../../util/toString';

export default function renderChart(props) {
    const height = `${props.height || 400}px`;
    const width = props.width ? `${props.width}px` : 'auto';
    const backgroundColor = props.backgroundColor;
    const defaultHighlightSeletion = props.defaultHighlightSeletion;
    return `
      document.getElementById('main').style.height = "${height}";
      document.getElementById('main').style.width = "${width}";
      document.getElementById('main').style.backgroundColor = "${backgroundColor}";
      var myChart = echarts.init(document.getElementById('main'));
      myChart.setOption(${toString(props.option)});
      
      myChart.on('click', function(params) {
        var seen = [];
        var paramsString = JSON.stringify(params, function(key, val) {
          if (val != null && typeof val == "object") {
            if (seen.indexOf(val) >= 0) {
              return;
            }
            seen.push(val);
          }
          return val;
        });
        window.postMessage(JSON.stringify({"types":"ON_PRESS","payload": paramsString}));
      });
    if(${defaultHighlightSeletion} !== null && ${defaultHighlightSeletion} !== undefined){
        var highlightSeletionIndex =  ${defaultHighlightSeletion} < ${props.option.series[0].data.length} ? ${defaultHighlightSeletion} : 0;
        // 默认选中第一条数据
        myChart.dispatchAction({
                type: 'highlight',
                seriesIndex: highlightSeletionIndex,
                dataIndex: highlightSeletionIndex
           });
       // myChart.dispatchAction({
       //         type: 'showTip',
       //        seriesIndex: highlightSeletionIndex,
       //          dataIndex: highlightSeletionIndex
       //     });

      lastMouseOverIndex=null;
      myChart.on('mouseover', function (params) {
          var dataLen = ${props.option.series[0].data.length} || 20;
          lastMouseOverIndex = params.dataIndex;
          for(var i=0;i<dataLen;i++){
              if(i!= params.dataIndex){
                 myChart.dispatchAction({
                    type: 'downplay',
                    seriesIndex: 0,
                    dataIndex: i
               })
           }
       }
   });
     myChart.on('mouseout', function (params) {
        myChart.dispatchAction({
           type: 'highlight',
           seriesIndex: 0,
           dataIndex: lastMouseOverIndex
       })  
   });
 }
   
    `
}
