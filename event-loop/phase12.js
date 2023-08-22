setTimeout(() => {
    console.log('first');
    let p = Promise.resolve();
    p.then(() => console.log('second'));
    p.then(() => console.log('third'));
}, 1)

setTimeout(() => {
    console.log('fourth')
}, 1);