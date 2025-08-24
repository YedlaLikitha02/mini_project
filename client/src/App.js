import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";

// Fix Leaflet icon issue
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// State data with CMs and political parties
const data = {
  "Andhra Pradesh": {
    centroid: [15.9129, 79.7400],
    cms: [
      { name: "Tanguturi Prakasam", period: "1953–1955", party: "INC" },
      { name: "Neelam Sanjiva Reddy", period: "1956–1960", party: "INC" },
      { name: "Damodaram Sanjivayya", period: "1960–1962", party: "INC" },
      { name: "Neelam Sanjiva Reddy", period: "1962–1964", party: "INC" },
      { name: "Kasu Brahmananda Reddy", period: "1964–1971", party: "INC" },
      { name: "P. V. Narasimha Rao", period: "1971–1973", party: "INC" },
      { name: "Jalagam Vengala Rao", period: "1973–1978", party: "INC" },
      { name: "Marri Chenna Reddy", period: "1978–1980", party: "INC" },
      { name: "T. Anjaiah", period: "1980–1982", party: "INC" },
      { name: "Bhavanam Venkatarami Reddy", period: "1982–1983", party: "INC" },
      { name: "N. T. Rama Rao", period: "1983–1984", party: "TDP" },
      { name: "Nadendla Bhaskara Rao", period: "1984", party: "TDP" },
      { name: "N. T. Rama Rao", period: "1984–1989", party: "TDP" },
      { name: "Marri Chenna Reddy", period: "1989–1990", party: "INC" },
      { name: "N. Janardhana Reddy", period: "1990–1992", party: "INC" },
      { name: "Kotla Vijaya Bhaskara Reddy", period: "1992–1994", party: "INC" },
      { name: "N. T. Rama Rao", period: "1994–1995", party: "TDP" },
      { name: "N. Chandrababu Naidu", period: "1995–2004", party: "TDP" },
      { name: "Y. S. Rajasekhara Reddy", period: "2004–2009", party: "INC" },
      { name: "K. Rosaiah", period: "2009–2010", party: "INC" },
      { name: "N. Kiran Kumar Reddy", period: "2010–2014", party: "INC" },
      { name: "N. Chandrababu Naidu", period: "2014–2019", party: "TDP" },
      { name: "Y. S. Jagan Mohan Reddy", period: "2019–present", party: "YSRCP" }
    ],
    yearlyData: {
      1953: "INC", 1956: "INC", 1960: "INC", 1962: "INC", 1964: "INC", 
      1971: "INC", 1973: "INC", 1978: "INC", 1980: "INC", 1982: "INC", 
      1983: "TDP", 1984: "TDP", 1989: "INC", 1990: "INC", 1992: "INC", 
      1994: "TDP", 1995: "TDP", 2004: "INC", 2009: "INC", 2010: "INC", 
      2014: "TDP", 2019: "YSRCP", 2023: "YSRCP"
    }
  },
  "Arunachal Pradesh": {
    centroid: [28.2180, 94.7278],
    cms: [
      { name: "Pema Khandu", period: "2016–present", party: "BJP" }
    ],
    yearlyData: {
      2016: "BJP", 2019: "BJP", 2024: "BJP"
    }
  },
  "Assam": {
    centroid: [26.2006, 92.9376],
    cms: [
      { name: "Gopinath Bordoloi", period: "1946–1950", party: "INC" },
      { name: "Tarun Gogoi", period: "2001–2016", party: "INC" },
      { name: "Himanta Biswa Sarma", period: "2021–present", party: "BJP" }
    ],
    yearlyData: {
      1950: "INC", 2001: "INC", 2016: "BJP", 2021: "BJP"
    }
  },
  "Bihar": {
    centroid: [25.0961, 85.3131],
    cms: [
      { name: "Krishna Sinha", period: "1946–1961", party: "INC" },
      { name: "Deep Narayan Singh", period: "1961", party: "INC" },
      { name: "Binodanand Jha", period: "1961–1963", party: "INC" },
      { name: "K. B. Sahay", period: "1963–1967", party: "INC" },
      { name: "Mahamaya Prasad Sinha", period: "1967–1968", party: "Jana Kranti Dal" },
      { name: "Satish Prasad Singh", period: "1968", party: "INC" },
      { name: "Bindeshwari Dubey", period: "1968", party: "INC" },
      { name: "Harihar Singh", period: "1969", party: "INC" },
      { name: "Bhola Paswan Shastri", period: "1968–1972", party: "INC" },
      { name: "Karpuri Thakur", period: "1970–1971, 1977–1979", party: "JNP" },
      { name: "Jagannath Mishra", period: "1975–1977, 1980–1983, 1989–1990", party: "INC" },
      { name: "Chandrashekhar Singh", period: "1983–1985", party: "INC" },
      { name: "Bindeshwari Dubey", period: "1985–1988", party: "INC" },
      { name: "Satyendra Narayan Sinha", period: "1989", party: "INC" },
      { name: "Lalu Prasad Yadav", period: "1990–1997", party: "RJD" },
      { name: "Rabri Devi", period: "1997–2005", party: "RJD" },
      { name: "Nitish Kumar", period: "2005–2014, 2015–present", party: "JD(U)" },
      { name: "Jitan Ram Manjhi", period: "2014–2015", party: "HAMS" }
    ],
    yearlyData: {
      1950: "INC", 1967: "Jana Kranti Dal", 1977: "JNP", 1980: "INC",
      1990: "RJD", 2000: "RJD", 2005: "JD(U)", 2010: "JD(U)",
      2015: "JD(U)", 2020: "JD(U)"
    }
  },
  "West Bengal": {
  centroid: [22.9868, 87.8550],
  cms: [
    { name: "Prafulla Chandra Ghosh", period: "1947–1948", party: "INC" },
    { name: "Bidhan Chandra Roy", period: "1948–1962", party: "INC" },
    { name: "Prafulla Chandra Sen", period: "1962–1967", party: "INC" },
    { name: "Ajoy Kumar Mukherjee", period: "1967", party: "Bangla Congress" },
    { name: "Prafulla Chandra Ghosh", period: "1967", party: "INC" },
    { name: "Ajoy Kumar Mukherjee", period: "1969–1970", party: "Bangla Congress" },
    { name: "President's Rule", period: "1970–1971", party: "President's Rule" },
    { name: "Ajoy Kumar Mukherjee", period: "1971", party: "Bangla Congress" },
    { name: "President's Rule", period: "1971–1972", party: "President's Rule" },
    { name: "Siddhartha Shankar Ray", period: "1972–1977", party: "INC" },
    { name: "Jyoti Basu", period: "1977–2000", party: "CPI(M)" },
    { name: "Buddhadeb Bhattacharjee", period: "2000–2011", party: "CPI(M)" },
    { name: "Mamata Banerjee", period: "2011–present", party: "AITC" }
  ],
  yearlyData: {
    1947: "INC",
    1967: "Bangla Congress",
    1971: "INC",
    1977: "CPI(M)",
    2000: "CPI(M)",
    2011: "AITC",
    2016: "AITC",
    2021: "AITC",
    2023: "AITC"
  }
},

  "Maharashtra": {
    centroid: [19.7515, 75.7139],
    cms: [
      { name: "Yashwantrao Chavan", period: "1960–1962", party: "INC" },
      { name: "Marotrao Kannamwar", period: "1962–1963", party: "INC" },
      { name: "P. K. Sawant", period: "1963", party: "INC" },
      { name: "Vasantrao Naik", period: "1963–1975", party: "INC" },
      { name: "Shankarrao Chavan", period: "1975–1977", party: "INC" },
      { name: "Vasantdada Patil", period: "1977–1978", party: "INC" },
      { name: "Sharad Pawar", period: "1978–1980", party: "INC" },
      { name: "A. R. Antulay", period: "1980–1982", party: "INC" },
      { name: "Babasaheb Bhosale", period: "1982–1983", party: "INC" },
      { name: "Vasantdada Patil", period: "1983–1985", party: "INC" },
      { name: "Shivajirao Patil Nilangekar", period: "1985–1986", party: "INC" },
      { name: "Shankarrao Chavan", period: "1986–1988", party: "INC" },
      { name: "Sharad Pawar", period: "1988–1991", party: "INC" },
      { name: "Sudhakarrao Naik", period: "1991–1993", party: "INC" },
      { name: "Sharad Pawar", period: "1993–1995", party: "INC" },
      { name: "Manohar Joshi", period: "1995–1999", party: "Shiv Sena" },
      { name: "Narayan Rane", period: "1999", party: "Shiv Sena" },
      { name: "Vilasrao Deshmukh", period: "1999–2003", party: "INC" },
      { name: "Sushilkumar Shinde", period: "2003–2004", party: "INC" },
      { name: "Vilasrao Deshmukh", period: "2004–2008", party: "INC" },
      { name: "Ashok Chavan", period: "2008–2010", party: "INC" },
      { name: "Prithviraj Chavan", period: "2010–2014", party: "INC" },
      { name: "Devendra Fadnavis", period: "2014–2019", party: "BJP" },
      { name: "Uddhav Thackeray", period: "2019–2022", party: "Shiv Sena" },
      { name: "Eknath Shinde", period: "2022–present", party: "Shiv Sena" }
    ],
    yearlyData: {
      1960: "INC", 1962: "INC", 1963: "INC", 1975: "INC", 1977: "INC", 
      1978: "INC", 1980: "INC", 1982: "INC", 1983: "INC", 1985: "INC", 
      1986: "INC", 1988: "INC", 1991: "INC", 1993: "INC", 1995: "Shiv Sena", 
      1999: "INC", 2003: "INC", 2004: "INC", 2008: "INC", 2010: "INC", 
      2014: "BJP", 2019: "Shiv Sena", 2022: "Shiv Sena"
    }
  },
  "Manipur": {
    centroid: [24.6637, 93.9063],
    cms: [
  { name: "Mairembam Koireng Singh", period: "1963–1967, 1967–1972, 1974–1977", party: "INC" },
  { name: "Rishang Keishing", period: "1980–1988, 1994–1997", party: "INC" },
  { name: "Radhabinod Koijam", period: "2001", party: "Samata Party" },
  { name: "Okram Ibobi Singh", period: "2002–2017", party: "INC" },
  { name: "N. Biren Singh", period: "2017–present", party: "BJP" }
],
    yearlyData: {
  1972: "INC", 1974: "INC", 1980: "INC", 1984: "INC", 1990: "President's Rule",
  1995: "INC", 2000: "Samata Party", 2002: "INC", 2007: "INC", 2012: "INC",
  2017: "BJP", 2022: "BJP"
}
  },
  "Meghalaya": {
    centroid: [25.4670, 91.3662],
    cms: [
  { name: "Williamson A. Sangma", period: "1972–1975, 1976–1978, 1983–1988", party: "INC" },
  { name: "B. B. Lyngdoh", period: "1979–1981, 1990–1993, 1998–2000", party: "UDP" },
  { name: "D. D. Lapang", period: "1992–1993, 2003–2005, 2007–2008, 2009–2010", party: "INC" },
  { name: "Mukul Sangma", period: "2010–2018", party: "INC" },
  { name: "Conrad Sangma", period: "2018–present", party: "NPP" }
],
   yearlyData: {
  1972: "INC", 1978: "APHLC", 1983: "INC", 1990: "UDP", 1993: "INC",
  1998: "UDP", 2003: "INC", 2008: "INC", 2013: "INC", 2018: "NPP", 2023: "NPP"
}

  },
  "Mizoram": {
    centroid: [23.1645, 92.9376],
    cms: [
  { name: "Lal Thanhawla", period: "1984–1986, 1989–1998, 2008–2018", party: "INC" },
  { name: "Zoramthanga", period: "1998–2008, 2018–2023", party: "MNF" },
  { name: "Lalduhoma", period: "2023–present", party: "ZPM" }
],

   yearlyData: {
  1987: "INC", 1989: "INC", 1993: "INC", 1998: "MNF", 2003: "MNF", 2008: "INC",
  2013: "INC", 2018: "MNF", 2023: "ZPM"
}

  },
  "Nagaland": {
    centroid: [26.1584, 94.5624],
    cms: [
  { name: "P. Shilu Ao", period: "1963–1966", party: "NNO" },
  { name: "S. C. Jamir", period: "1980–1986, 1989–1990, 1993–2003", party: "INC" },
  { name: "Neiphiu Rio", period: "2003–present", party: "NPF/NDPP" }
],

   yearlyData: {
  1963: "NNO", 1982: "INC", 1989: "INC", 1993: "INC", 2003: "NPF",
  2008: "NPF", 2013: "NPF", 2018: "NDPP", 2023: "NDPP"
}

  },
  "Tripura": {
    centroid: [23.9408, 91.9882],
   cms: [
  { name: "Sukhamoy Sen Gupta", period: "1972–1977", party: "INC" },
  { name: "Nripen Chakraborty", period: "1978–1988", party: "CPI(M)" },
  { name: "Manik Sarkar", period: "1998–2018", party: "CPI(M)" },
  { name: "Biplab Deb", period: "2018–2022", party: "BJP" },
  { name: "Manik Saha", period: "2022–present", party: "BJP" }
],

   yearlyData: {
  1972: "INC", 1978: "CPI(M)", 1988: "INC", 1993: "CPI(M)", 1998: "CPI(M)",
  2003: "CPI(M)", 2008: "CPI(M)", 2013: "CPI(M)", 2018: "BJP", 2023: "BJP"
}

  },
  "Haryana": {
    centroid: [29.0588, 76.0856],
    cms: [
      { name: "B. D. Sharma", period: "1966–1967", party: "INC" },
      { name: "Rao Birender Singh", period: "1967–1968", party: "INC" },
      { name: "Bansi Lal", period: "1968–1975", party: "INC" },
      { name: "Banarsi Das Gupta", period: "1975–1977", party: "INC" },
      { name: "Devi Lal", period: "1977–1979", party: "JNP" },
      { name: "Bhajan Lal", period: "1979–1985", party: "INC" },
      { name: "Bansi Lal", period: "1985–1987", party: "INC" },
      { name: "Devi Lal", period: "1987–1989", party: "INLD" },
      { name: "Om Prakash Chautala", period: "1989–1991", party: "JD" },
      { name: "Hukam Singh", period: "1991", party: "JD" },
      { name: "Bhajan Lal", period: "1991–1996", party: "INC" },
      { name: "Bansi Lal", period: "1996–1999", party: "HVP" },
      { name: "Om Prakash Chautala", period: "1999–2005", party: "INLD" },
      { name: "Bhupinder Singh Hooda", period: "2005–2014", party: "INC" },
      { name: "Manohar Lal Khattar", period: "2014–present", party: "BJP" }
    ],
    yearlyData: {
      1966: "INC", 1967: "INC", 1968: "INC", 1975: "INC", 1977: "JNP", 
      1979: "INC", 1985: "INC", 1987: "INLD", 1989: "JD", 1991: "INC", 
      1996: "HVP", 1999: "INLD", 2005: "INC", 2014: "BJP", 2019: "BJP", 
      2023: "BJP"
    }
  },
  "Chhattisgarh": {
    centroid: [21.2787, 81.8661],
    cms: [
      { name: "Ajit Jogi", period: "2000–2003", party: "INC" },
      { name: "Raman Singh", period: "2003–2018", party: "BJP" },
      { name: "Bhupesh Baghel", period: "2018–2023", party: "INC" },
      { name: "Vishnu Deo Sai", period: "2023–present", party: "BJP" }
    ],
    yearlyData: {
      2000: "INC", 2003: "BJP", 2018: "INC", 2023: "BJP"
    }
  },
  "Karnataka": {
    centroid: [15.3173, 75.7139],
    cms: [
      { name: "S. R. Kanthi", period: "1956", party: "INC" },
      { name: "Kadidal Manjappa", period: "1956", party: "INC" },
      { name: "S. Nijalingappa", period: "1956–1958", party: "INC" },
      { name: "B. D. Jatti", period: "1958–1962", party: "INC" },
      { name: "S. R. Kanthi", period: "1962", party: "INC" },
      { name: "S. Nijalingappa", period: "1962–1968", party: "INC" },
      { name: "Veerendra Patil", period: "1968–1971", party: "INC" },
      { name: "D. Devaraj Urs", period: "1972–1977", party: "INC" },
      { name: "D. Devaraj Urs", period: "1978–1980", party: "INC(U)" },
      { name: "R. Gundu Rao", period: "1980–1983", party: "INC" },
      { name: "Ramakrishna Hegde", period: "1983–1988", party: "JP" },
      { name: "S. R. Bommai", period: "1988–1989", party: "JP" },
      { name: "Veerendra Patil", period: "1989–1990", party: "INC" },
      { name: "S. Bangarappa", period: "1990–1992", party: "INC" },
      { name: "Veerappa Moily", period: "1992–1994", party: "INC" },
      { name: "H. D. Deve Gowda", period: "1994–1996", party: "JD" },
      { name: "J. H. Patel", period: "1996–1999", party: "JD" },
      { name: "S. M. Krishna", period: "1999–2004", party: "INC" },
      { name: "Dharam Singh", period: "2004–2006", party: "INC+JD(S)" },
      { name: "H. D. Kumaraswamy", period: "2006–2007", party: "JD(S)" },
      { name: "B. S. Yediyurappa", period: "2007", party: "BJP" },
      { name: "H. D. Kumaraswamy", period: "2007", party: "JD(S)" },
      { name: "B. S. Yediyurappa", period: "2008–2011", party: "BJP" },
      { name: "D. V. Sadananda Gowda", period: "2011–2012", party: "BJP" },
      { name: "Jagadish Shettar", period: "2012–2013", party: "BJP" },
      { name: "Siddaramaiah", period: "2013–2018", party: "INC" },
      { name: "H. D. Kumaraswamy", period: "2018–2019", party: "JD(S)+INC" },
      { name: "B. S. Yediyurappa", period: "2019–2021", party: "BJP" },
      { name: "Basavaraj Bommai", period: "2021–2023", party: "BJP" },
      { name: "Siddaramaiah", period: "2023–present", party: "INC" }
    ],
    yearlyData: {
      1956: "INC", 1960: "INC", 1965: "INC", 1972: "INC", 1978: "INC(U)", 
      1980: "INC", 1983: "JP", 1985: "JP", 1989: "INC", 1994: "JD", 
      1999: "INC", 2004: "INC", 2006: "JD(S)", 2008: "BJP", 2013: "INC", 
      2018: "JD(S)+INC", 2019: "BJP", 2023: "INC"
    }
  },
  "Kerala": {
    centroid: [10.8505, 76.2711],
    cms: [
      { name: "E. M. S. Namboodiripad", period: "1957–1959", party: "CPI" },
      { name: "Pattom A. Thanu Pillai", period: "1960–1962", party: "PSP" },
      { name: "R. Sankar", period: "1962–1964", party: "INC" },
      { name: "President's Rule", period: "1964–1967", party: "President's Rule" },
      { name: "E. M. S. Namboodiripad", period: "1967–1969", party: "CPI(M)" },
      { name: "C. Achutha Menon", period: "1969–1977", party: "CPI" },
      { name: "K. Karunakaran", period: "1977", party: "INC" },
      { name: "A. K. Antony", period: "1977–1978", party: "INC" },
      { name: "P. K. Vasudevan Nair", period: "1978–1979", party: "CPI" },
      { name: "C. H. Mohammed Koya", period: "1979", party: "IUML" },
      { name: "President's Rule", period: "1979–1980", party: "President's Rule" },
      { name: "E. K. Nayanar", period: "1980–1981", party: "CPI(M)" },
      { name: "K. Karunakaran", period: "1982–1987", party: "INC" },
      { name: "E. K. Nayanar", period: "1987–1991", party: "CPI(M)" },
      { name: "K. Karunakaran", period: "1991–1995", party: "INC" },
      { name: "A. K. Antony", period: "1995–1996", party: "INC" },
      { name: "E. K. Nayanar", period: "1996–2001", party: "CPI(M)" },
      { name: "A. K. Antony", period: "2001–2004", party: "INC" },
      { name: "Oommen Chandy", period: "2004–2006", party: "INC" },
      { name: "V. S. Achuthanandan", period: "2006–2011", party: "CPI(M)" },
      { name: "Oommen Chandy", period: "2011–2016", party: "INC" },
      { name: "Pinarayi Vijayan", period: "2016–present", party: "CPI(M)" }
    ],
    yearlyData: {
      1957: "CPI", 1960: "PSP", 1962: "INC", 1967: "CPI(M)",
      1970: "CPI", 1977: "INC", 1980: "CPI(M)", 1982: "INC",
      1987: "CPI(M)", 1991: "INC", 1996: "CPI(M)", 2001: "INC",
      2006: "CPI(M)", 2011: "INC", 2016: "CPI(M)", 2021: "CPI(M)"
    }
  },
  "Madhya Pradesh": {
    centroid: [22.9734, 78.6569],
    cms: [
      { name: "Ravishankar Shukla", period: "1956–1957", party: "INC" },
      { name: "Bhagwantrao Mandloi", period: "1957–1957", party: "INC" },
      { name: "Kailash Nath Katju", period: "1957–1962", party: "INC" },
      { name: "Dwarka Prasad Mishra", period: "1963–1967", party: "INC" },
      { name: "Govind Narayan Singh", period: "1967–1969", party: "INC (O)" },
      { name: "Shyama Charan Shukla", period: "1969–1975, 1985–1988", party: "INC" },
      { name: "Prakash Chandra Sethi", period: "1972–1975", party: "INC" },
      { name: "Kailash Joshi", period: "1977–1978", party: "JNP" },
      { name: "Virendra Kumar Sakhlecha", period: "1978–1980", party: "JNP" },
      { name: "Arjun Singh", period: "1980–1985, 1988–1989", party: "INC" },
      { name: "Moti Lal Vora", period: "1989–1990", party: "INC" },
      { name: "Sunder Lal Patwa", period: "1990–1992", party: "BJP" },
      { name: "Digvijaya Singh", period: "1993–2003", party: "INC" },
      { name: "Uma Bharti", period: "2003–2004", party: "BJP" },
      { name: "Babulal Gaur", period: "2004–2005", party: "BJP" },
      { name: "Shivraj Singh Chouhan", period: "2005–2018, 2020–2023", party: "BJP" },
      { name: "Kamal Nath", period: "2018–2020", party: "INC" },
      { name: "Mohan Yadav", period: "2023–present", party: "BJP" }
    ],
    yearlyData: {
      1956: "INC", 1967: "INC (O)", 1977: "JNP", 1980: "INC",
      1990: "BJP", 1993: "INC", 2003: "BJP", 2018: "INC", 2020: "BJP", 2023: "BJP"
    }
  },
  "Telangana": {
    centroid: [18.1124, 79.0193],
    cms: [
      { name: "K. Chandrashekar Rao", period: "2014–2023", party: "TRS" },
      { name: "Revanth Reddy", period: "2023–present", party: "INC" }
    ],
    yearlyData: {
      2014: "TRS", 2019: "TRS", 2023: "INC"
    }
  },
  "Tamil Nadu": {
    centroid: [11.1271, 78.6569],
    cms: [
      { name: "C. N. Annadurai", period: "1967–1969", party: "DMK" },
      { name: "V. R. Nedunchezhiyan", period: "1969 (Acting)", party: "DMK" },
      { name: "M. Karunanidhi", period: "1969–1976", party: "DMK" },
      { name: "President's Rule", period: "1976–1977", party: "NA" },
      { name: "M. G. Ramachandran", period: "1977–1987", party: "AIADMK" },
      { name: "Janaki Ramachandran", period: "1988", party: "AIADMK" },
      { name: "President's Rule", period: "1988–1989", party: "NA" },
      { name: "M. Karunanidhi", period: "1989–1991", party: "DMK" },
      { name: "J. Jayalalithaa", period: "1991–1996", party: "AIADMK" },
      { name: "M. Karunanidhi", period: "1996–2001", party: "DMK" },
      { name: "J. Jayalalithaa", period: "2001–2006", party: "AIADMK" },
      { name: "M. Karunanidhi", period: "2006–2011", party: "DMK" },
      { name: "J. Jayalalithaa", period: "2011–2014", party: "AIADMK" },
      { name: "O. Panneerselvam", period: "2014–2015", party: "AIADMK" },
      { name: "J. Jayalalithaa", period: "2015–2016", party: "AIADMK" },
      { name: "O. Panneerselvam", period: "2016–2017", party: "AIADMK" },
      { name: "Edappadi K. Palaniswami", period: "2017–2021", party: "AIADMK" },
      { name: "M. K. Stalin", period: "2021–present", party: "DMK" }
    ],
    yearlyData: {
     // Continuing the Tamil Nadu yearlyData...
      1967: "DMK", 1969: "DMK", 1976: "NA", 1977: "AIADMK", 1984: "AIADMK",
      1988: "NA", 1989: "DMK", 1991: "AIADMK", 1996: "DMK", 2001: "AIADMK",
      2006: "DMK", 2011: "AIADMK", 2016: "AIADMK", 2021: "DMK", 2023: "DMK"
    }
  },
  "Gujarat": {
    centroid: [22.2587, 71.1924],
    cms: [
      { name: "Jivraj Narayan Mehta", period: "1960–1963", party: "INC" },
      { name: "Balwantrai Mehta", period: "1963–1965", party: "INC" },
      { name: "Hitendra K Desai", period: "1965–1971", party: "INC" },
      { name: "Ghanshyam Oza", period: "1971–1972", party: "INC" },
      { name: "Chimanbhai Patel", period: "1972–1974", party: "INC" },
      { name: "Babubhai J. Patel", period: "1975–1976", party: "INC" },
      { name: "Madhavsinh Solanki", period: "1976–1977", party: "INC" },
      { name: "Babubhai J. Patel", period: "1977–1980", party: "JNP" },
      { name: "Madhavsinh Solanki", period: "1980–1985", party: "INC" },
      { name: "Amarsinh Chaudhary", period: "1985–1989", party: "INC" },
      { name: "Madhavsinh Solanki", period: "1989–1990", party: "INC" },
      { name: "Chimanbhai Patel", period: "1990–1994", party: "JD/INC" },
      { name: "Keshubhai Patel", period: "1995–1998", party: "BJP" },
      { name: "Dilip Parikh", period: "1997–1998", party: "RJP" },
      { name: "Keshubhai Patel", period: "1998–2001", party: "BJP" },
      { name: "Narendra Modi", period: "2001–2014", party: "BJP" },
      { name: "Anandiben Patel", period: "2014–2016", party: "BJP" },
      { name: "Vijay Rupani", period: "2016–2021", party: "BJP" },
      { name: "Bhupendra Patel", period: "2021–present", party: "BJP" }
    ],
    yearlyData: {
      1960: "INC", 1963: "INC", 1965: "INC", 1971: "INC", 1972: "INC", 
      1975: "INC", 1976: "INC", 1977: "JNP", 1980: "INC", 1985: "INC", 
      1989: "INC", 1990: "JD", 1994: "INC", 1995: "BJP", 1997: "RJP", 
      1998: "BJP", 2001: "BJP", 2014: "BJP", 2016: "BJP", 2021: "BJP"
    }
  },
  "Rajasthan": {
    centroid: [27.0238, 74.2179],
    cms: [
      { name: "Heera Lal Shastri", period: "1949–1951", party: "INC" },
      { name: "Tika Ram Paliwal", period: "1952", party: "INC" },
      { name: "Jai Narayan Vyas", period: "1952–1954", party: "INC" },
      { name: "Mohar Singh", period: "1954", party: "INC" },
      { name: "Jai Narayan Vyas", period: "1954–1957", party: "INC" },
      { name: "Mohan Lal Sukhadia", period: "1954–1971", party: "INC" },
      { name: "Barkatullah Khan", period: "1971–1973", party: "INC" },
      { name: "Hari Dev Joshi", period: "1973–1977, 1985–1988, 1989–1990", party: "INC" },
      { name: "Bhairon Singh Shekhawat", period: "1977–1980, 1990–1992, 1993–1998", party: "JNP" },
      { name: "Shiv Charan Mathur", period: "1981–1985", party: "INC" },
      { name: "Ashok Gehlot", period: "1998–2003, 2008–2013, 2018–2023", party: "INC" },
      { name: "Vasundhara Raje", period: "2003–2008, 2013–2018", party: "BJP" },
      { name: "Bhajan Lal Sharma", period: "2023–present", party: "BJP" }
    ],
    yearlyData: {
      1952: "INC", 1977: "JNP", 1980: "INC", 1990: "JNP", 1993: "JNP",
      1998: "INC", 2003: "BJP", 2008: "INC", 2013: "BJP", 2018: "INC", 2023: "BJP"
    }
  },
  "Punjab": {
    centroid: [31.1471, 75.3412],
    cms: [
      { name: "Gopi Chand Bhargava", period: "1947–1951", party: "INC" },
      { name: "Bhagwan Singh", period: "1951–1956", party: "INC" },
      { name: "Partap Singh Kairon", period: "1956–1964", party: "INC" },
      { name: "Ram Kishan", period: "1964–1966", party: "INC" },
      { name: "Gurnam Singh", period: "1967–1969", party: "Akali Dal" },
      { name: "Justice Gurnam Singh", period: "1970", party: "Akali Dal" },
      { name: "Zail Singh", period: "1972–1977", party: "INC" },
      { name: "Parkash Singh Badal", period: "1977–1980, 1997–2002, 2007–2017", party: "SAD" },
      { name: "Darbara Singh", period: "1980–1983", party: "INC" },
      { name: "Surjit Singh Barnala", period: "1985–1987", party: "SAD" },
      { name: "Beant Singh", period: "1992–1995", party: "INC" },
      { name: "Rajinder Kaur Bhattal", period: "1996–1997", party: "INC" },
      { name: "Amarinder Singh", period: "2002–2007, 2017–2021", party: "INC" },
      { name: "Charanjit Singh Channi", period: "2021–2022", party: "INC" },
      { name: "Bhagwant Mann", period: "2022–present", party: "AAP" }
    ],
    yearlyData: {
      1952: "INC", 1967: "Akali Dal", 1972: "INC", 1977: "SAD", 1980: "INC",
      1992: "INC", 1997: "SAD", 2002: "INC", 2007: "SAD", 2017: "INC", 2022: "AAP"
    }
  },
  "Jharkhand": {
    centroid: [23.6102, 85.2799],
    cms: [
      { name: "Babulal Marandi", period: "2000–2003", party: "BJP" },
      { name: "Arjun Munda", period: "2003–2006, 2010–2013", party: "BJP" },
      { name: "Shibu Soren", period: "2005, 2008–2009, 2009–2010", party: "JMM" },
      { name: "Madhu Koda", period: "2006–2008", party: "Independent" },
      { name: "Hemant Soren", period: "2013–2014, 2019–2024", party: "JMM" },
      { name: "Raghubar Das", period: "2014–2019", party: "BJP" },
      { name: "Champai Soren", period: "2024–present", party: "JMM" }
    ],
    yearlyData: {
      2000: "BJP", 2005: "JMM", 2006: "Independent", 2010: "BJP",
      2013: "JMM", 2014: "BJP", 2019: "JMM", 2024: "JMM"
    }
  },
  "Uttarakhand": {
    centroid: [30.0668, 79.0193],
    cms: [
      { name: "Nityanand Swami", period: "2000–2001", party: "BJP" },
      { name: "Bhagat Singh Koshyari", period: "2001–2002", party: "BJP" },
      { name: "Narayan Datt Tiwari", period: "2002–2007", party: "INC" },
      { name: "Bhuwan Chandra Khanduri", period: "2007–2009, 2011–2012", party: "BJP" },
      { name: "Ramesh Pokhriyal", period: "2009–2011", party: "BJP" },
      { name: "Vijay Bahuguna", period: "2012–2014", party: "INC" },
      { name: "Harish Rawat", period: "2014–2017", party: "INC" },
      { name: "Trivendra Singh Rawat", period: "2017–2021", party: "BJP" },
      { name: "Tirath Singh Rawat", period: "2021", party: "BJP" },
      { name: "Pushkar Singh Dhami", period: "2021–present", party: "BJP" }
    ],
    yearlyData: {
      2000: "BJP", 2002: "INC", 2007: "BJP", 2012: "INC",
      2017: "BJP", 2022: "BJP"
    }
  },
  "Odisha": {
  "centroid": [20.9517, 85.0985],
  "cms": [
    { "name": "Harekrushna Mahatab", "period": "1946–1950", "party": "INC" },
    { "name": "Nabakrushna Choudhury", "period": "1950–1956", "party": "INC" },
    { "name": "Harekrushna Mahatab", "period": "1956–1961", "party": "INC" },
    { "name": "Biju Patnaik", "period": "1961–1963", "party": "INC" },
    { "name": "Biren Mitra", "period": "1963–1965", "party": "INC" },
    { "name": "Sadashiva Tripathy", "period": "1965–1967", "party": "INC" },
    { "name": "Rajendra Narayan Singh Deo", "period": "1967–1971", "party": "Swatantra" },
    { "name": "Bishwanath Das", "period": "1971–1972", "party": "Utkal Congress" },
    { "name": "Nandini Satpathy", "period": "1972–1976", "party": "INC" },
    { "name": "Binayak Acharya", "period": "1976–1977", "party": "INC" },
    { "name": "Nilamani Routray", "period": "1977–1980", "party": "JNP" },
    { "name": "J. B. Patnaik", "period": "1980–1989", "party": "INC" },
    { "name": "Hemananda Biswal", "period": "1989–1990", "party": "INC" },
    { "name": "Biju Patnaik", "period": "1990–1995", "party": "JD" },
    { "name": "J. B. Patnaik", "period": "1995–1999", "party": "INC" },
    { "name": "Giridhar Gamang", "period": "1999–2000", "party": "INC" },
    { "name": "Hemananda Biswal", "period": "2000", "party": "INC" },
    { "name": "Naveen Patnaik", "period": "2000–present", "party": "BJD" }
  ],
  "yearlyData": {
    "1950": "INC", "1960": "INC", "1965": "INC", "1970": "Swatantra",
    "1975": "INC", "1980": "INC", "1985": "INC", "1990": "JD",
    "1995": "INC", "2000": "BJD", "2005": "BJD", "2010": "BJD",
    "2015": "BJD", "2020": "BJD", "2024": "BJP" // (if updated based on 2024 elections)
  }
},

  "Uttar Pradesh": {
    centroid: [26.8467, 80.9462],
    cms: [
      { name: "Govind Ballabh Pant", period: "1950–1954", party: "INC" },
      { name: "Sampurnanand", period: "1954–1960", party: "INC" },
      { name: "Chandra Bhanu Gupta", period: "1960–1963", party: "INC" },
      { name: "Sucheta Kripalani", period: "1963–1967", party: "INC" },
      { name: "Chandra Bhanu Gupta", period: "1967", party: "INC" },
      { name: "Charan Singh", period: "1967–1968", party: "BKD" },
      { name: "President's Rule", period: "1968–1969", party: "President's Rule" },
      { name: "Chandra Bhanu Gupta", period: "1969–1970", party: "INC" },
      { name: "Charan Singh", period: "1970", party: "BKD" },
      { name: "President's Rule", period: "1970–1971", party: "President's Rule" },
      { name: "Kamalapati Tripathi", period: "1971–1973", party: "INC" },
      { name: "Hemwati Nandan Bahuguna", period: "1973–1975", party: "INC" },
      { name: "N. D. Tiwari", period: "1976–1977", party: "INC" },
      { name: "Ram Naresh Yadav", period: "1977–1979", party: "JNP" },
      { name: "Banarsi Das", period: "1979–1980", party: "JNP" },
      { name: "Vishwanath Pratap Singh", period: "1980–1982", party: "INC" },
      { name: "Sripati Mishra", period: "1982–1984", party: "INC" },
      { name: "N. D. Tiwari", period: "1984–1985", party: "INC" },
      { name: "Vir Bahadur Singh", period: "1985–1988", party: "INC" },
      { name: "N. D. Tiwari", period: "1988–1989", party: "INC" },
      { name: "Mulayam Singh Yadav", period: "1989–1991", party: "JD" },
      { name: "Kalyan Singh", period: "1991–1992", party: "BJP" },
      { name: "President's Rule", period: "1992–1993", party: "President's Rule" },
      { name: "Mulayam Singh Yadav", period: "1993–1995", party: "SP" },
      { name: "Mayawati", period: "1995", party: "BSP" },
      { name: "President's Rule", period: "1995–1997", party: "President's Rule" },
      { name: "Kalyan Singh", period: "1997–1999", party: "BJP" },
      { name: "Ram Prakash Gupta", period: "1999–2000", party: "BJP" },
      { name: "Rajnath Singh", period: "2000–2002", party: "BJP" },
      { name: "Mayawati", period: "2002–2003", party: "BSP" },
      { name: "Mulayam Singh Yadav", period: "2003–2007", party: "SP" },
      { name: "Mayawati", period: "2007–2012", party: "BSP" },
      { name: "Akhilesh Yadav", period: "2012–2017", party: "SP" },
      { name: "Yogi Adityanath", period: "2017–present", party: "BJP" }
    ],
    yearlyData: {
      1950: "INC", 1960: "INC", 1967: "INC", 1970: "President's Rule",
      1972: "INC", 1977: "JNP", 1980: "INC", 1985: "INC", 1989: "JD",
      1991: "BJP", 1993: "SP", 1995: "BSP", 1997: "BJP", 2002: "BSP",
      2004: "SP", 2007: "BSP", 2012: "SP", 2017: "BJP", 2022: "BJP"
    }
  }

};

// All available years from the data
const allYears = [1953, 1956, 1960, 1962, 1963, 1964, 1965, 1966, 1967, 1968, 1971, 1972, 
                 1973, 1975, 1976, 1977, 1978, 1979, 1980, 1982, 1983, 1984, 1985, 1986, 
                 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 
                 1999, 2000, 2001, 2003, 2004, 2005, 2008, 2009, 2010, 2014, 2016, 2018, 
                 2019, 2021, 2022, 2023];

const partyColors = {
  // Existing
  "INC": "#00A651",
  "BJP": "#FF9933",
  "JNP": "#8B4513",
  "JD": "#A0522D",
  "INLD": "#006400",
  "HVP": "#800080",
  "TRS": "#FF1493",
  "YSRCP": "#0000CD",
  "SP": "#DC143C",
  "BSP": "#4169E1",
  "DMK": "#800000",
  "AIADMK": "#228B22",
  "AMMK": "#FFD700",
  "NTK": "#B22222",
  "DMDK": "#1E90FF",
  "JD(S)": "#3CB371",
  "BKD": "#D2691E",
  "IUML": "#2E8B57",
  "President's Rule": "#808080",

  // New Parties
  "CPI": "#FF6347",
  "CPI(M)": "#B22222",
  "PSP": "#9370DB",
  "HAMS": "#9ACD32",
  "Jana Kranti Dal": "#DAA520",
  "INC (O)": "#4169E1",
  "AAP": "#2F8D46",
  "SAD": "#000080",
  "JMM": "#556B2F",
  "Independent": "#708090",
  "Akali Dal": "#191970",
  "MNF": "#A0522D",
  "ZPM": "#5F9EA0",
  "NDPP": "#BA55D3",
  "NPP": "#4682B4",
   "Swatantra": "#9370DB",
  "Utkal Congress": "#FF69B4",
  "BJD": "#228B22",
 "AITC": "#00B894", 
"Bangla Congress": "#6C5CE7",

  

  "default": "#CCCCCC"
};

// Create a separate component for state markers that will update when props change
function StateMarker({ stateName, stateData, partyName, onClick }) {
  const fillColor = partyName ? partyColors[partyName] : partyColors.default;
  
  return (
    <CircleMarker
      center={stateData.centroid}
      radius={12}
      fillColor={fillColor}
      color="#fff"
      weight={2}
      opacity={1}
      fillOpacity={0.8}
      eventHandlers={{
        click: () => onClick(stateName),
        mouseover: (e) => {
          const layer = e.target;
          layer.setStyle({
            weight: 3,
            color: '#333',
            fillOpacity: 0.9
          });
        },
        mouseout: (e) => {
          const layer = e.target;
          layer.setStyle({
            weight: 2,
            color: '#fff',
            fillOpacity: 0.8
          });
        }
      }}
    >
      <Tooltip direction="top" offset={[0, -8]} permanent>
        <div className="circle-tooltip">
          <strong>{stateName}</strong>
        </div>
      </Tooltip>
    </CircleMarker>
  );
}

function App() {
  const [selectedState, setSelectedState] = useState("");
  const [selectedYear, setSelectedYear] = useState(2023);
  const [stateYearlyData, setStateYearlyData] = useState({});
  const [cmInfo, setCmInfo] = useState({});
  const [loadingCM, setLoadingCM] = useState("");

const fetchCMInfo = async (cmName) => {
    setLoadingCM(cmName);
    try {
      const response = await fetch(process.env.REACT_APP_GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama3-70b-8192',
          messages: [
            { role: "system", content: "You are an expert political historian of India. Give concise factual biography of Chief Ministers." },
            { role: "user", content: `Give a brief political biography of ${cmName}` }
          ],
          max_tokens: 500
        })
      });

      const data = await response.json();
      if (data.choices && data.choices[0].message.content) {
        setCmInfo(prev => ({ ...prev, [cmName]: data.choices[0].message.content }));
      }
    } catch (error) {
      setCmInfo(prev => ({ ...prev, [cmName]: "Error fetching information." }));
    } finally {
      setLoadingCM("");
    }
  };
  // Process state data based on selected year
  useEffect(() => {
    if (selectedYear) {
      const yearData = {};
      
      // For each state, find the party ruling in the selected year or closest year before
      Object.keys(data).forEach(state => {
        if (data[state].yearlyData) {
          const stateYears = Object.keys(data[state].yearlyData)
            .map(Number)
            .filter(year => year <= selectedYear)
            .sort((a, b) => b - a);
          
          if (stateYears.length > 0) {
            const closestYear = stateYears[0];
            yearData[state] = data[state].yearlyData[closestYear];
          }
        }
      });
      
      setStateYearlyData(yearData);
    }
  }, [selectedYear]);

  // Handle state click
  const onStateClick = (stateName) => {
    if (data[stateName]) {
      setSelectedState(stateName);
    }
  };

  // Handle year change
  const handleYearChange = (e) => {
    setSelectedYear(Number(e.target.value));
  };
  
  // Close state info panel
  const closeStateInfo = () => {
    setSelectedState("");
  };

  return (
    <div className="app-container">
      <h1>Bharat’s Political Map: Parties in Power & Chief Ministers Through Time(1953-2023)</h1>
      
      <div className="year-selector">
        <h3>Select Year:</h3>
        <select
          value={selectedYear}
          onChange={handleYearChange}
          className="year-dropdown"
        >
          {allYears.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <span className="selected-year">{selectedYear}</span>
      </div>
      
      <div className="content-container">
        <div className="map-container">
          <MapContainer
            center={[22.5937, 78.9629]}
            zoom={5}
            style={{ height: "450px", width: "100%" }}
            minZoom={4}
            maxZoom={7}
            scrollWheelZoom={false}
          >
            {/* Add a tile layer for reference */}
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            
            {/* Add circle markers for each state using the StateMarker component */}
            {Object.keys(data).map(stateName => (
              <StateMarker
                key={`${stateName}-${stateYearlyData[stateName] || 'default'}-${selectedYear}`}
                stateName={stateName}
                stateData={data[stateName]}
                partyName={stateYearlyData[stateName]}
                onClick={onStateClick}
              />
            ))}
          </MapContainer>
          
          <div className="legend">
            <h4>Political Parties</h4>
            <div className="legend-items">
              {Object.keys(partyColors).map(party => (
                party !== 'default' && (
                  <div key={party} className="legend-item">
                    <div 
                      className="color-box" 
                      style={{ backgroundColor: partyColors[party] }}
                    ></div>
                    <span>{party}</span>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
        
        {selectedState && (
          <div className="state-info">
            <div className="state-header">
              <h2>{selectedState}</h2>
              <button className="close-btn" onClick={closeStateInfo}>&times;</button>
            </div>
            <div className="current-party">
              <h3>Current Ruling Party: 
                <span className="party-badge" style={{ 
                  backgroundColor: partyColors[stateYearlyData[selectedState]] || partyColors.default,
                  color: ['YSRCP', 'INC', 'TRS', 'INLD', 'HVP'].includes(stateYearlyData[selectedState]) ? 'white' : 'black'
                }}>
                  {stateYearlyData[selectedState]}
                </span>
              </h3>
            </div>
            <h3>Chief Ministers</h3>
            <div className="cm-list-container">
              <ul className="cm-list">
                {data[selectedState].cms.map((cm, index) => (
                  <li key={index} className="cm-item">
                    <div
                      className="cm-name clickable"
                      onClick={() => fetchCMInfo(cm.name)}
                      style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                    >
                      {cm.name}
                    </div>
                    <div className="cm-period">{cm.period}</div>
                    <div
                      className="cm-party"
                      style={{
                        backgroundColor: partyColors[cm.party] || partyColors.default,
                        color: ['YSRCP', 'INC', 'TRS', 'INLD', 'HVP'].includes(cm.party) ? 'white' : 'black'
                      }}
                    >
                      {cm.party}
                    </div>

                    {/* ✅ Show loading or fetched info */}
                    {loadingCM === cm.name && <div>Loading...</div>}
                    {cmInfo[cm.name] && (
  <div className="cm-info">
    <span 
      className="cm-info-close" 
      onClick={() => setCmInfo(prev => ({ ...prev, [cm.name]: undefined }))}
    >
      &times;
    </span>
    {cmInfo[cm.name]}
  </div>
)}

                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;