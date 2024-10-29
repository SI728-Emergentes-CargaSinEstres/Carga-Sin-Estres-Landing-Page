import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Reservation } from '../models/reservation.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CargaSinEstresDataService {
  base_url = environment.baseURL;

  constructor( private http: HttpClient) {
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlQGdtYWlsLmNvbSIsImlhdCI6MTcwMDY4MjY4NCwiZXhwIjoxNzA5MDAyNjg0LCJyb2xlcyI6WyJST0xFX1VTRVIiXX0.5fJ4KkmgMiPQj0jQs8Ss7LslBJ9mxpS6CeyJTNvnbDY`
    })
  }

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.log(`Ocurrió un error: ${error.status}, el cuerpo fue: ${error.error}`);
    }
    else {
      console.log(`El servidor respondió con el código ${error.status}, el cuerpo fue: ${error.error}`);
    }
    return throwError('Ha ocurrido un problema con la solicitud, por favor inténtalo de nuevo más tarde');
  }

  //Company Controller ---------------------------------------------------------------
  getAllCompanies(): Observable<any> {
    return this.http.get<any>(this.base_url+"/companies", this.httpOptions).pipe(retry(2),catchError(this.handleError));
  }
  
  getCompanyById(id: any): Observable<any> {
    return this.http.get<any>(`${this.base_url}/companies/${id}`, this.httpOptions).pipe(retry(2),catchError(this.handleError));
  }

  getCompanyByName(name: any): Observable<any> {
    return this.http.get<any>(`${this.base_url}/companiesByName?name=${name}`, this.httpOptions).pipe(retry(2),catchError(this.handleError));
  }

  getCompaniesForLogin(email: string, password: string): Observable<any> {
    return this.http.get(`${this.base_url}/companiesForLogin?email=${email}&password=${password}`, this.httpOptions);
  }

  createCompany(data: any): Observable<any> {
    return this.http.post(`${this.base_url}/companies`, JSON.stringify(data), this.httpOptions);
  }
  
  createTimeblock(idCompany: any): Observable<any>{
    return this.http.post(`${this.base_url}/timeblock/`, { startTime: '08:00', endTime: '17:00', companyId: idCompany}, 
  {headers: {'Content-Type': 'application/json'}});
  }

  updateCompany(id: any, data: any): Observable<any> {
    return this.http.patch(`${this.base_url}/companies/${id}`, JSON.stringify(data), this.httpOptions);
  }

  updateTimeblock(timeblockId:any, data:any): Observable<any>{
    return this.http.put(`${this.base_url}/timeblock/${timeblockId}`, data);
  }

  getTimeblock(companyId: any): Observable<any>{
    return this.http.get(`${this.base_url}/timeblock/${companyId}`, this.httpOptions);
  }

  //BookingHistory Controller ---------------------------------------------------------------
  createReservation(customerId: any, companyId: any, item: any): Observable<Reservation>{
    return this.http.post<Reservation>(`${this.base_url}/reservations?customerId=${customerId}&idCompany=${companyId}`, JSON.stringify(item), this.httpOptions).pipe(retry(2),catchError(this.handleError));
  }

  getReservationByCustomerId(clientId: any): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.base_url}/reservations/customer/${clientId}`, this.httpOptions)
      .pipe(retry(2),catchError(this.handleError))
  }

  getReservationByCompanyId(companyId: any): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.base_url}/reservations/company/${companyId}`, this.httpOptions)
      .pipe(retry(2),catchError(this.handleError))
  }

  //update status
  updateReservationStatus(companyId: any, status: string, data: any): Observable<any> {
    return this.http.patch(`${this.base_url}/reservations/${companyId}/status?status=${status}`, JSON.stringify(data), this.httpOptions);
  }

//update payment
  //http://localhost:8080/api/v1/reservations/1/price-startDate-startTime-status?price=10&startDate=2024-05-06&startTime=10%3A30&status=to%20be%20schedule
  updateReservationPayment(id: any, price:any, startDate: any, startTime:any): Observable<Reservation> {
    if (startDate instanceof Date) {
      startDate = startDate.toISOString().split('T')[0];
      // Continúa con el código que utiliza startDateISOString
    }
    let response;
    response = this.http.patch<Reservation>
    (`${this.base_url}/reservations/${id}/price-startDate-startTime?price=${price}&startDate=${startDate}&startTime=${startTime}`,
        {
          id: id,
          price:price,
          startDate:startDate,
          startTime:startTime
        })
        .pipe(retry(2),catchError(this.handleError))

    console.log(response);
    return response;
  }

  //update end date and end time
  updateReservationEndDateAndEndTime(id: any, endDate: String, endTime: string): Observable<Reservation> {
    return this.http.patch<Reservation>(`${this.base_url}/reservations/${id}/endDate-endTime`, this.httpOptions)
      .pipe(retry(2),catchError(this.handleError))
  }

  //Chat Controller ---------------------------------------------------------------
  updateReservationMessage(id: any, userType:any,data: any): Observable<any> {

    // Combina los datos proporcionados con el userType en un nuevo objeto
    const requestData = {
      content:data,
      userType: userType // Añade el userType al objeto de datos
    };

    return this.http.post<any>(`${this.base_url}/messages/${id}`, requestData, this.httpOptions)
      .pipe(retry(2),catchError(this.handleError))
  }

  getMessagesByReservation(reservationId: any): Observable<any> {
    return this.http.get<any>(`${this.base_url}/messages/${reservationId}`, this.httpOptions)
        .pipe(retry(2),catchError(this.handleError))
  }
  
  //Client Controller ---------------------------------------------------------------
  getCustomersForLogin(email: string, password: string): Observable<any> {
    const url = `${this.base_url}/customers?email=${email}&password=${password}`;
    return this.http.get(`${url}`, this.httpOptions);
  }

  createCustomer(data: any): Observable<any> {
    return this.http.post(`${this.base_url}/customers`, JSON.stringify(data), this.httpOptions);
  }

  //for settings
  updateCustomer(id: any, data: any): Observable<any> {
    return this.http.patch(`${this.base_url}/customers/${id}`, JSON.stringify(data), this.httpOptions);
  }

  //get client by id
  getCustomerById(customerId: any): Observable<any> {
    return this.http.get<any>(`${this.base_url}/customers/${customerId}`, this.httpOptions)
    .pipe(retry(2),catchError(this.handleError));
  }

  //Services Controller ------------------------------------------------------------------

  getAllServicios() {
    return this.http.get(`${this.base_url}/services`, this.httpOptions)
        .pipe(retry(2),catchError(this.handleError));
  }

  getAllServices(): Observable<any> {
    return this.http.get<any>(this.base_url+"/services", this.httpOptions).pipe(retry(2),catchError(this.handleError));
  }


  //Subscription Controller ---------------------------------------------------------------
  createMembership(companyId: any, data: any): Observable<any> {
    return this.http.post<any>(`${this.base_url}/memberships/${companyId}`, JSON.stringify(data), this.httpOptions)
      .pipe(retry(2),catchError(this.handleError));
  }

  searchExistingMembership(companyId: any): Observable<boolean> {
    return this.http.get<any[]>(`${this.base_url}/subscriptions/${companyId}`, this.httpOptions)
      .pipe(
        map((subscriptions: any[]) => subscriptions.length > 0)
      );
  }
  
  //Review Controller ---------------------------------------------------------------
  addReview(companyId: any, review: any): Observable<any> {
    console.log('review:', review);
    console.log('companyId:', companyId);
    return this.http.post<any>(`${this.base_url}/${companyId}/ratings`, review, this.httpOptions)
      .pipe(retry(2),catchError(this.handleError));
  }

  getReviewsByCompanyId(companyId: any): Observable<any> {
    return this.http.get<any>(`${this.base_url}/reviews/${companyId}`, this.httpOptions)
      .pipe(retry(2),catchError(this.handleError))
  }
  

  // Obtain companies by status of the reservation
  getReservationsByCompanyIdAndStatus(companyId: any, status: string): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.base_url}/reservations/company/${companyId}?status=${status}`, this.httpOptions)
        .pipe(
            retry(2),
            catchError(this.handleError)
        );
  }


  //for ubigeo
  getDepartamentos(): Observable<string[]> {
    return this.http.get<string[]>(`${this.base_url}/departamentos`)
      .pipe(
        map(departamentos => [...new Set(departamentos)])
      );
  }

  getProvincias(departamento: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.base_url}/provincias/${departamento}`)
      .pipe(
        map(provincias => [...new Set(provincias)]) 
      );
  }

  getDistritos(provincia: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.base_url}/distritos/${provincia}`)
      .pipe(
        map(distritos => [...new Set(distritos)]) 
      );
  }

  getLocation(idUbigeo: any): Observable<string[]> {
    return this.http.get<string[]>(`${this.base_url}/location/${idUbigeo}`);
  }

  



      
}
