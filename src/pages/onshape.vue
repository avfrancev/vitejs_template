<template lang="pug">
.container.mx-auto.space-y-3.pt-4
  textarea.textarea.w-full.textarea-bordered(v-model="cutList" rows="8" )
  //- pre {{ parsedCutList }}
  div(v-for="c,i in parsedCutList")
    .flex.space-x-2
      pre: b {{ c.material }} 
      .flex.join
        label.join-item.flex.input.input-xs.input-bordered.space-x-2 
          //- b.flex-1 {{ c.material }} 
          input.w-10.text-right(type="number" v-model.number="parsedCutList[i].qty")
          //- span mm
        label.join-item.flex.input.input-xs.input-bordered.space-x-2 
          //- b.flex-1 {{ c.material }} 
          input.w-14.text-right(type="number" v-model.number="parsedCutList[i].length")
          span mm
        //- input.input.input-xs.input-bordered(type="number" v-model.number="parsedCutList[i].qty")
        //- input.input.input-xs.input-bordered(type="number" v-model.number="parsedCutList[i].length")
      
  div(v-for="g,k in groupedParsedCutList")
    pre: b.text-xl
      b {{k}}
      span  [{{g.materialMaxLength || 6000 }}mm]
      input.input.text-right(type="number" v-model.number="g.materialMaxLength")

    .space-y-1
      .flex.h-6.w-full.bg-base-300.rounded.overflow-hidden(v-for="P in g.cuttingPlan")
        .bg-accent.text-accent-content.text-center.content-center.outline.outline-accent-content(
          v-for="p in P"
          :style="{width: p ? (p/(g.materialMaxLength || 6000)*100 + '%') : 'auto'}"
          :class="{ 'bg-error text-error-content': !p }"
          ) {{ p ? p : ' ERR ' }}
        pre.content-center.text-center.flex-1.px-2(v-if="(g.materialMaxLength || 6000) - P.sum") {{(g.materialMaxLength || 6000) - P.sum}}
    
    //- pre {{ g.cuttingPlan }}
  //- pre {{ groupedParsedCutList }}
</template>

<script setup>
// material	Qty	Length	Angle 1	Angle 2
// 40x40	2	800 mm	45 deg	45 deg
// 40x40	2	3000 mm	45 deg	45 deg
// 40x40	4	760 mm	0 deg	0 deg
// 20x20	2	2920 mm	0 deg	0 deg
// 20x40	12	740 mm	0 deg	0 deg
// 20x20	2	720 mm	0 deg	0 deg
// DPK 140x20	10	720 mm	0 deg	0 deg
// DPK 140x20	10	2920 mm	0 deg	0 deg
// make linear cutting calculator
const parseOnshapeCutList = (s) => {
  const lines = s.split('\n').filter(line => line.trim() !== '')

  const objects = lines.map(line => {
    const [material, qty, length, angle1, angle2, materialMaxLength] = line.split('\t')
    // console.log(materialMaxLength, line.split('\t'));
    
    return { material, qty: parseInt(qty), length: parseFloat(length), angle1: parseFloat(angle1), angle2: parseFloat(angle2), materialMaxLength: parseFloat(materialMaxLength) }
  })

  return objects
}

const cutList = ref(`40x40	2	800 mm	45 deg	45 deg\t3000 mm
40x40	2	3000 mm	45 deg	45 deg\t4000 mm
40x40	4	760 mm	0 deg	0 deg
20x20	2	2920 mm	0 deg	0 deg
20x40	12	740 mm	0 deg	0 deg
20x20	2	720 mm	0 deg	0 deg
DPK 140x20	10	720 mm	0 deg	0 deg
DPK 140x20	10	2920 mm	0 deg	0 deg`)

// let parsedCutList = computed(() => parseOnshapeCutList(cutList.value))
const parsedCutList = reactive( parseOnshapeCutList(cutList.value))
watchEffect(() => {
  Object.assign(parsedCutList, parseOnshapeCutList(cutList.value))
})


const groupedParsedCutList = computed(() => parsedCutList.reduce((acc, cut) => {
  if (!acc[cut.material]) {
    acc[cut.material] = []
  }
  acc[cut.material].materialMaxLength = Math.max(acc[cut.material].materialMaxLength || 0, cut.materialMaxLength || 0)
  acc[cut.material].push(cut)
  return acc
}, {}) )

const stockMaterials = reactive([
  { material: '40x40', qty: 2, length: 3333},
  { material: '20x40', qty: 2, length: 3333},
  { material: '20x20', qty: 2, length: 3333},
])

watchEffect(() => {
  // console.log(groupedParsedCutList.value);
  Object.entries(groupedParsedCutList.value).forEach(g => {
    g[1].cuttingPlan = cuttingPlan(g[1])
    g[1].cuttingPlan.forEach(cp => {
      cp.sum = cp.reduce((a, b) => a + b, 0)
    })
  })
  // console.log('watchEffect', groupedParsedCutList.value);
})



function cuttingPlan(cutList, maxCutLength = 6000) {
    if (!Array.isArray(cutList)) {
        throw new Error('cutList must be an array');
    }
    cutList.sort((a, b) => a.length - b.length);
    
    const patternList = [];
    let currentPattern = [];
    let currentLength = 0;
    console.log({cutList});
    for (const cut of cutList) {
        let _maxCutLength = cutList.materialMaxLength || maxCutLength 
        for (let qty = 0; qty < cut.qty; qty++) {
            if (cut.length > _maxCutLength) {
              // throw new Error('cut length exceeds _maxCutLength');
              currentPattern.push(null)
              break
            } 
            if (currentLength + cut.length <= _maxCutLength) {
              currentPattern.push(cut.length);
              currentLength += cut.length;
            // } else if (cut.length <= maxCutLength) {
            //     patternList.push([...currentPattern, cut.length]);
            //     currentPattern = [cut.length];
            //     currentLength = cut.length;
            } else {
                patternList.push(currentPattern);
                currentPattern = [cut.length];
                currentLength = cut.length;
            }
        }
    }
    
    if (currentPattern.length) {
        patternList.push(currentPattern);
    }
    
    return patternList;
}



</script>