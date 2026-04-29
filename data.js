// ===== CONFIGURACIÓN =====
const RATES = { chaturbate: 0.05, stripchat: 0.05, camsoda: 0.04 };
const MONITORS = {
  'mañana': ['Dani', 'Ramón'],
  'tarde': ['Mónica', 'Santiago'],
  'noche': ['César', 'Juan']
};
const QUINCENA = { inicio: '2026-04-16', fin: '2026-04-30', numero: 2 };

// ===== DATA REAL QUINCENA 2 (Abr 16-30) =====
const SAMPLE = [
  // TURNO MAÑANA
  {id:1,nickname:"Anne.cox",monitor:"Dani",realName:"Ana Sofia Ospina Ortega",goal:1500,chaturbate:12766,stripchat:9854,camsoda:0,pda:true,shift:"mañana",obs:""},
  {id:2,nickname:"Bella_donne",monitor:"Ramón",realName:"Alejandra Rojas Vargas",goal:5500,chaturbate:65550,stripchat:0,camsoda:0,pda:true,shift:"mañana",obs:""},
  {id:3,nickname:"Lily StClair",monitor:"Dani",realName:"Alexa Rivera Montoya",goal:2000,chaturbate:6180,stripchat:21944,camsoda:0,pda:true,shift:"mañana",obs:""},
  {id:4,nickname:"Miagag",monitor:"Dani",realName:"Vanessa Arroyave",goal:1200,chaturbate:31188,stripchat:69964,camsoda:0,pda:true,shift:"mañana",obs:""},
  {id:5,nickname:"Ariana_giraldo",monitor:"Dani",realName:"Luz Magnolia Salazar Garcai",goal:2000,chaturbate:17058,stripchat:16450,camsoda:0,pda:true,shift:"mañana",obs:""},
  {id:6,nickname:"Avy Rose",monitor:"Ramón",realName:"Maria Alejandra Gutiérrez Viña",goal:1500,chaturbate:13486,stripchat:5416,camsoda:0,pda:true,shift:"mañana",obs:""},
  {id:7,nickname:"Loxlee",monitor:"Dani",realName:"Valentina Osorno Alvarez",goal:1500,chaturbate:11992,stripchat:13904,camsoda:0,pda:true,shift:"mañana",obs:""},
  {id:8,nickname:"Violeta Marquez",monitor:"Dani",realName:"Sara Arango Zuleta",goal:1500,chaturbate:8634,stripchat:13106,camsoda:0,pda:true,shift:"mañana",obs:""},
  {id:9,nickname:"Megan Myers",monitor:"Dani",realName:"Ashly Naibel Burgos Machado",goal:800,chaturbate:23192,stripchat:1760,camsoda:0,pda:true,shift:"mañana",obs:""},
  {id:10,nickname:"Alma Sterling",monitor:"Ramón",realName:"Violeta Alvarez Lopera",goal:800,chaturbate:6874,stripchat:0,camsoda:0,pda:true,shift:"mañana",obs:""},
  {id:11,nickname:"MelodyBloom_",monitor:"Dani",realName:"Valentina Zapata Azcuntar",goal:1500,chaturbate:8864,stripchat:12226,camsoda:0,pda:true,shift:"mañana",obs:""},
  {id:12,nickname:"Celeste_dalton",monitor:"Ramón",realName:"Nicoll Pulgarin Nohava",goal:800,chaturbate:10944,stripchat:12424,camsoda:0,pda:true,shift:"mañana",obs:""},
  {id:13,nickname:"Eva_kingsford",monitor:"Ramón",realName:"Evelyn Tamayo Zapata",goal:800,chaturbate:9162,stripchat:9964,camsoda:0,pda:true,shift:"mañana",obs:""},
  {id:14,nickname:"Noa_butterfly",monitor:"Ramón",realName:"Manuela Giraldo Muñoz",goal:800,chaturbate:13054,stripchat:1808,camsoda:0,pda:true,shift:"mañana",obs:""},
  {id:15,nickname:"Lulu_Mei_",monitor:"Ramón",realName:"Mariana Sanchez Llamoza",goal:800,chaturbate:3378,stripchat:1498,camsoda:0,pda:true,shift:"mañana",obs:""},
  {id:16,nickname:"Tori_gaviria",monitor:"Ramón",realName:"Liliana Castillo Salgado",goal:800,chaturbate:4828,stripchat:0,camsoda:0,pda:true,shift:"mañana",obs:""},
  // TURNO TARDE
  {id:17,nickname:"Mafee Saenz",monitor:"Mónica",realName:"Natalia Hernandez Llano",goal:1600,chaturbate:28291,stripchat:24886,camsoda:0,pda:true,shift:"tarde",obs:""},
  {id:18,nickname:"Katie shuangs",monitor:"Santiago",realName:"Susana Pelaez",goal:5000,chaturbate:0,stripchat:55196,camsoda:0,pda:true,shift:"tarde",obs:""},
  {id:19,nickname:"Saday",monitor:"Santiago",realName:"Evelin Saday Ricardo Solis",goal:3000,chaturbate:17582,stripchat:25068,camsoda:0,pda:true,shift:"tarde",obs:""},
  {id:20,nickname:"Mia Medina",monitor:"Mónica",realName:"Diana Luz Agamez Gonzalez",goal:2000,chaturbate:6976,stripchat:24830,camsoda:0,pda:true,shift:"tarde",obs:""},
  {id:21,nickname:"Sofia Rousse",monitor:"Mónica",realName:"Dayannis Tobon Acosta",goal:3200,chaturbate:28978,stripchat:7706,camsoda:0,pda:true,shift:"tarde",obs:""},
  {id:22,nickname:"Michelle Cute",monitor:"Mónica",realName:"Asoryana Ramos Briseño",goal:2500,chaturbate:18438,stripchat:28840,camsoda:0,pda:true,shift:"tarde",obs:""},
  {id:23,nickname:"Agatha Steel",monitor:"Mónica",realName:"Yesmi Diaz Ruiz",goal:2000,chaturbate:40542,stripchat:0,camsoda:0,pda:true,shift:"tarde",obs:""},
  {id:24,nickname:"Sophie Velvet",monitor:"Mónica",realName:"Nataly Cardenas Moreno",goal:2000,chaturbate:11742,stripchat:43066,camsoda:0,pda:true,shift:"tarde",obs:""},
  {id:25,nickname:"kendall_evanss_",monitor:"Santiago",realName:"Valentina Marquez Pino",goal:1200,chaturbate:29086,stripchat:19054,camsoda:0,pda:true,shift:"tarde",obs:""},
  {id:26,nickname:"Mia_Rivers_",monitor:"Santiago",realName:"Camila Zuluaga Prieto",goal:1200,chaturbate:0,stripchat:33912,camsoda:0,pda:true,shift:"tarde",obs:""},
  {id:27,nickname:"Marlee Rosee",monitor:"Mónica",realName:"Maria Camila Correa Muñoz",goal:6500,chaturbate:56120,stripchat:66000,camsoda:0,pda:true,shift:"tarde",obs:""},
  {id:28,nickname:"Amara_Mercer",monitor:"Santiago",realName:"Meliza Serna Parra",goal:800,chaturbate:9162,stripchat:0,camsoda:0,pda:true,shift:"tarde",obs:""},
  {id:29,nickname:"Eisarajim",monitor:"Santiago",realName:"Luisa Fernanda Osorio Jimenez",goal:800,chaturbate:58162,stripchat:0,camsoda:0,pda:true,shift:"tarde",obs:""},
  // TURNO NOCHE
  {id:30,nickname:"Camila_Harrington",monitor:"César",realName:"Yeimy Viviana Osorio Rojas",goal:800,chaturbate:6420,stripchat:11792,camsoda:0,pda:true,shift:"noche",obs:""},
  {id:31,nickname:"celeste_valencia1",monitor:"César",realName:"Sara Paulina Mejia Marin",goal:3000,chaturbate:45084,stripchat:42682,camsoda:0,pda:true,shift:"noche",obs:""},
  {id:32,nickname:"Julieth_Rojas",monitor:"César",realName:"Maria Jose Lopez Mejia",goal:1500,chaturbate:1566,stripchat:6906,camsoda:0,pda:true,shift:"noche",obs:""},
  {id:33,nickname:"Sofia_mercer",monitor:"César",realName:"Luisa Fernanda Rodriguez Calderon",goal:800,chaturbate:18078,stripchat:6024,camsoda:0,pda:true,shift:"noche",obs:""},
  {id:34,nickname:"Ninna_vinns",monitor:"Juan",realName:"Angie Marcela Villa Carmona",goal:1500,chaturbate:14690,stripchat:9698,camsoda:0,pda:true,shift:"noche",obs:""},
  {id:35,nickname:"bela_palmer",monitor:"Juan",realName:"Isabella Gutierrez Rivera",goal:3000,chaturbate:7256,stripchat:10054,camsoda:0,pda:true,shift:"noche",obs:""},
  {id:36,nickname:"angelina_honey_",monitor:"Juan",realName:"Andrea Carolina Gomez Rodelo",goal:1200,chaturbate:20846,stripchat:20908,camsoda:0,pda:true,shift:"noche",obs:""},
  {id:37,nickname:"valentina_briar",monitor:"Juan",realName:"Viviana Marcela Zambrano Mosquera",goal:800,chaturbate:146,stripchat:2014,camsoda:0,pda:true,shift:"noche",obs:""}
];

// ===== TABLA DE COMISIONES (aplica a todos los turnos) =====
const COMMISSION_TIERS = [
  { facturacionUSD: 7000,  bonoCOP: 500000,   totalTokens: 140000 },
  { facturacionUSD: 8750,  bonoCOP: 900000,   totalTokens: 175000 },
  { facturacionUSD: 10500, bonoCOP: 1200000,  totalTokens: 210000 },
  { facturacionUSD: 12250, bonoCOP: 1500000,  totalTokens: 245000 },
  { facturacionUSD: 14000, bonoCOP: 2000000,  totalTokens: 280000 },
  { facturacionUSD: 15750, bonoCOP: 2500000,  totalTokens: 315000 },
  { facturacionUSD: 17500, bonoCOP: 3000000,  totalTokens: 350000 },
  { facturacionUSD: 21000, bonoCOP: 3700000,  totalTokens: 420000 },
  { facturacionUSD: 24500, bonoCOP: 4500000,  totalTokens: 490000 },
  { facturacionUSD: 30000, bonoCOP: 5500000,  totalTokens: 600000 },
  { facturacionUSD: 35000, bonoCOP: 6500000,  totalTokens: 700000 },
  { facturacionUSD: 40000, bonoCOP: 8000000,  totalTokens: 800000 },
  { facturacionUSD: 50000, bonoCOP: 10000000, totalTokens: 1000000 }
];

// REGLAS DE COMISIONES:
// - Facturación mínima: 7,000 USD
// - Capacidad base: 8 modelos
// - $600 USD por modelo hueco del total (-1)
// - No entran modelos que salen en quincena o entran a quincena media
// - Si 1 solo modelo hace el 40% de la facturación total → se baja al bono anterior
// - Si un monitor tiene 9 modelos en algún punto → todas las facturaciones base suben $800 USD
// - Bonos se pagan los días 6 o 21 del mes
const COMMISSION_RULES = {
  facturacionMinima: 7000,
  capacidadBase: 8,
  huecoDescuento: 600,
  umbral40Porciento: 0.40,
  penalizacion9Modelos: 800,
  diasPago: [6, 21]
};
