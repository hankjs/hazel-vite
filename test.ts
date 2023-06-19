const data = {
    forRe: { max: 0, min: 0, avg: 0, },
    for: { max: 0, min: 0, avg: 0, },
    forEach: { max: 0, min: 0, avg: 0, },
    foOf: { max: 0, min: 0, avg: 0, },
}
const output = []

function test(million) {
    // 注：这是稀疏数组，应该为其指定内容，否则不同方式的循环对其的处理方式会不同：
    const arr = [...Array(million)]

    const start = performance.now()

    for (let i = arr.length; i > 0; i--) {} // for(倒序)  :- 1.5ms
    const forReTime = performance.now() - start

    const start2 = performance.now()

    for (let i = 0; i < arr.length; i++) {} // for          :- 1.6ms
    const forTime = performance.now() - start2

    const start3 = performance.now()

    arr.forEach((v) => v); // foreach      :- 2.1ms
    const forEachTime = performance.now() - start3

    const start4 = performance.now()

    for (const v of arr) { } // for...of     :- 11.7ms
    const forOfTime = performance.now() - start4

    output.push({
        forRe: { max: forReTime, min: forReTime, avg: forReTime, },
        for: { max: forTime, min: forTime, avg: forTime, },
        forEach: { max: forEachTime, min: forEachTime, avg: forEachTime, },
        foOf: { max: forOfTime, min: forOfTime, avg: forOfTime, },
    })
}

test(100)
test(1000)
test(2000)
test(5000)
test(10000)
test(1000000)
test(2000000)

console.log(output)