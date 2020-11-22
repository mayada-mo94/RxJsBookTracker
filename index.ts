import { Observable, of, from, fromEvent, concat, Subscriber, interval, timer, throwError, Subject, observable, queueScheduler, asyncScheduler, asapScheduler, merge } from 'rxjs';
import { allBooks, allReaders } from './data';
import { ajax, AjaxResponse } from 'rxjs/ajax';
import { mergeMap, filter, tap, catchError, take } from 'rxjs/operators';

//#region the basic way to create a new Observable
// let allBooksObservable$ = new Observable(subscriber => {
  
//   if (document.title !== 'RxBookTracker') {
//     subscriber.error('Incorrect page title');
//   }

//   for (let book of allBooks) {
//     subscriber.next(book);
//   }

//   setTimeout(() => {
//     subscriber.complete();
//   }, 2000);

//   return () => console.log('Executing teardown code');

// });

// allBooksObservable$.subscribe((book: any) => console.log(book.title));
//#endregion 

//#region combaine two observable into one,when get data from two resources and combined into asingle data stream 
// let source1$= of('hello',10, true, allReaders[0].name ); // return observable
// //source1$.subscribe(value=> console.log(value));
// let source2$= from(allBooks);  // return observable
// source2$.subscribe(book=> console.log(book.title));
// concat(source1$, source2$)
//   .subscribe(value => console.log(value));
//#endregion 

//#region Observable to handle events
// let button = document.getElementById('readersButton');
// fromEvent(button, 'click') //this func return observable
//   .subscribe(event => {
//     console.log(event);
//     let readersDiv = document.getElementById('readers');
//     for (let reader of allReaders) {
//       readersDiv.innerHTML += reader.name + '<br>';
//     }
//   })
//#endregion

//#region Making Ajax requests from RxJs
// let button = document.getElementById('readersButton');
// fromEvent(button, 'click') //this func return observable
//   .subscribe(event => {
//     ajax('api/readers').subscribe(AjaxResponse => {
//       console.log(AjaxResponse);
//       let readers= AjaxResponse.response;
//       let readersDiv = document.getElementById('readers');
//       for (let reader of readers) {
//              readersDiv.innerHTML += reader.name + '<br>';
//             }
//     })
//   })
//#endregion

//#region Subscribing to Observables with Observers 
// let books$= from(allBooks);
// let bookObservable= {
//     next:book=>console.log(book.title),
//     error:err=>console.log(`Error:${err}`),
//     complete:()=> console.log('all done')
// }
// books$.subscribe(
//     book=>console.log(book.title),
//     err=>console.log(`Error:${err}`),
//     ()=> console.log('all done')
// )
//#endregion

//#region Mutiple Observers Executing a Single Observable
// let currentTime$= new Observable(Subscriber=>{
//     const timeString=new Date().toLocaleTimeString();
//     Subscriber.next(timeString);
//     Subscriber.complete();
// })
// currentTime$.subscribe(
//     currentTime=> console.log(`Observer 1: ${currentTime}`)
// );
// setTimeout(()=>{
//     currentTime$.subscribe(
//         currentTime=> console.log(`Observer 2: ${currentTime}`)
//     );  
// },1000);
// setTimeout(()=>{
//     currentTime$.subscribe(
//         currentTime=> console.log(`Observer 3: ${currentTime}`)
//     );  
// },2000);
//#endregion

//#region Subscription
//Subscription good for one important thing cancelling the execution of an observable 
// return stream of integers
// let timesDiv = document.getElementById('times');
// let button = document.getElementById('timerButton');
// //let timer$ = interval(1000);
// let timer$ = new Observable(Subscriber => {
//     let i = 0;
//     let intervalID = setInterval(() => {
//         Subscriber.next(i++);
//     }, 1000)
//     return () => {
//         console.log('Executing teardown code.');
//         clearInterval();
//     }
// });
// let timerSubscription= timer$.subscribe(
//     value=> timesDiv.innerHTML+=`${new Date().toLocaleTimeString()} (${value})<br>`,
//     null,
//     ()=> console.log('all done')
// );

// // add one subscription to another and cancel both in single call.
// let timerConsoleSubscription = timer$.subscribe(
//     value=> console.log(`${new Date().toLocaleTimeString()} (${value})`)
// )
// timerSubscription.add(timerConsoleSubscription);
// fromEvent(button,'click').subscribe(
//     event=> timerSubscription.unsubscribe()
// );
//#endregion

//#region Using Operators & Handling errors 
// test hanlding error by using => ajax('/api/errors/500')
// ajax('/api/books')
//     .pipe(
//         mergeMap(AjaxResponse => AjaxResponse.response),//map one value to another 
//         filter(book2 => book2.publicationYear < 1950),
//         tap(oldBook => console.log(`Title :${oldBook.title}`)),//same value  as source of observable 
//        // catchError(err => of({ title: 'Cordoury', author: 'Don Freeman' }))//catch errors thrown from the observable that returned by any of the other operators return new Observable and throw error 
//        // catchError((err,caught)=> caught)
//        // catchError(err=> throw `Something bad happened- ${err.message}`)
//        // catchError(err=> return throwError(err.message))
//     )
//     .subscribe(value => console.log(value),
//         error => console.error(`Error:${error}`)
//     )
//#endregion

//#region Creating Your Own Operators
// function grabAndLogClassics(year, log) {
//     return source$ => {
//         return new Observable(subscriber => {
//             source$.subscribe(
//                 book => {
//                     if (book.publicationYear < year) {
//                         subscriber.next(book);
//                         if (log) {
//                             console.log(`Classic:${book.title}`)
//                         }
//                     }
//                 },
//                err=>subscriber.error(err),
//                ()=> subscriber.complete()
//             );
//         })
//     }
// }
// function grabAndLogClassics(year, log) {
//     return filter(book => book.publicationYear < year);
// }
// ajax('/api/books')
//     .pipe(
//         mergeMap(AjaxResponse => AjaxResponse.response),//map one value to another 
//        // filter(book2 => book2.publicationYear < 1950),
//        // tap(oldBook => console.log(`Title :${oldBook.title}`)),//same value  as source of observable 
//        grabAndLogClassics(1950,true)
//     )
//     .subscribe(value => console.log(value),
//         error => console.error(`Error:${error}`)
//     )
//#endregion

//#region Using Subject and Multicasted Observables
// let subject$ = new Subject();
// subject$.subscribe(
//     value=> console.log(`Observable 1: ${value}`)
// );
// subject$.subscribe(
//     value=> console.log(`Observable 2: ${value}`)
// );
// //the subject should loop over the array of observers and push that value out to each of them 
// subject$.next('Hello !');


// // the subject sits between the source observable and the observers that ultimately receive the produced values
// // the source produces a value by calling next method on the subject it in turn ,loop over its observers and pushes the same value to each of them
// let source$= new Observable(Subscriber=>{
//     Subscriber.next('Greeting !');
// });
// source$.subscribe(subject$);
//#endregion

//#region interval func return cold observable 
// each observable separately received 
// let source$ = interval(1000).pipe(
//     take(4)
// );
// source$.subscribe(
//     value=>console.log(`Observable 1 : ${value}`)
// );
// setTimeout(() => {
//     source$.subscribe(
//         value=>console.log(`Observable 2 : ${value}`)
//     );    
// }, 1000);
// setTimeout(() => {
//     source$.subscribe(
//         value=>console.log(`Observable 3 : ${value}`)
//     );    
// }, 2000);

//#endregion

//#region Convert an  observable  from cold to hot 
//not every observer gets every value , producer of those values (observers) shared across all observable 
// let source$ = interval(1000).pipe(
//     take(4)
// );
// let subject$ = new Subject();
// // observable => subject => observers 
// source$.subscribe(subject$);

// subject$.subscribe(
//     value=>console.log(`Observable 1 : ${value}`)
// );
// setTimeout(() => {
//     subject$.subscribe(
//         value=>console.log(`Observable 2 : ${value}`)
//     );    
// }, 1000);
// setTimeout(() => {
//     subject$.subscribe(
//         value=>console.log(`Observable 3 : ${value}`)
//     );    
// }, 2000);
//#endregion



//#region Controlling Execution with Schedulers 
let queue$= of('QueueScheduler (synchronous)',queueScheduler);
let asap$= of('AsapeScheduler (async micro task)',asapScheduler);
let async$= of('AsyncScheduler (async task)',asyncScheduler);
///,animationFrameScheduler);
merge(queue$,asap$,async$).subscribe(
    value=> console.log(value)
);
//#endregion