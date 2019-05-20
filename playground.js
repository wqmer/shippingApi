// const phantom = require('phantom');
// const createOrder = require('./uility/api').createOrder
const uuid = require('uuid')
const request = require('request');
const async = require('async');
const fs = require('fs');
const extend = require('extend');
const base64 = require('base64topdf');
const convert = require('convert-units')
const moment = require('moment')
const config = require('./service/config')
const USPS = require('usps-webtools');
// const fs = requrie('fs')

// console.log(config.fedex)
// let label =  "JVBERi0xLjQKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMyAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL091dGxpbmVzCi9Db3VudCAwCj4+CmVuZG9iagozIDAgb2JqCjw8Ci9UeXBlIC9QYWdlcwovQ291bnQgMQovS2lkcyBbMTggMCBSXQo+PgplbmRvYmoKNCAwIG9iagpbL1BERiAvVGV4dCAvSW1hZ2VCIC9JbWFnZUMgL0ltYWdlSV0KZW5kb2JqCjUgMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9CYXNlRm9udCAvSGVsdmV0aWNhCi9FbmNvZGluZyAvTWFjUm9tYW5FbmNvZGluZwo+PgplbmRvYmoKNiAwIG9iago8PAovVHlwZSAvRm9udAovU3VidHlwZSAvVHlwZTEKL0Jhc2VGb250IC9IZWx2ZXRpY2EtQm9sZAovRW5jb2RpbmcgL01hY1JvbWFuRW5jb2RpbmcKPj4KZW5kb2JqCjcgMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9CYXNlRm9udCAvSGVsdmV0aWNhLU9ibGlxdWUKL0VuY29kaW5nIC9NYWNSb21hbkVuY29kaW5nCj4+CmVuZG9iago4IDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9TdWJ0eXBlIC9UeXBlMQovQmFzZUZvbnQgL0hlbHZldGljYS1Cb2xkT2JsaXF1ZQovRW5jb2RpbmcgL01hY1JvbWFuRW5jb2RpbmcKPj4KZW5kb2JqCjkgMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9CYXNlRm9udCAvQ291cmllcgovRW5jb2RpbmcgL01hY1JvbWFuRW5jb2RpbmcKPj4KZW5kb2JqCjEwIDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9TdWJ0eXBlIC9UeXBlMQovQmFzZUZvbnQgL0NvdXJpZXItQm9sZAovRW5jb2RpbmcgL01hY1JvbWFuRW5jb2RpbmcKPj4KZW5kb2JqCjExIDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9TdWJ0eXBlIC9UeXBlMQovQmFzZUZvbnQgL0NvdXJpZXItT2JsaXF1ZQovRW5jb2RpbmcgL01hY1JvbWFuRW5jb2RpbmcKPj4KZW5kb2JqCjEyIDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9TdWJ0eXBlIC9UeXBlMQovQmFzZUZvbnQgL0NvdXJpZXItQm9sZE9ibGlxdWUKL0VuY29kaW5nIC9NYWNSb21hbkVuY29kaW5nCj4+CmVuZG9iagoxMyAwIG9iago8PAovVHlwZSAvRm9udAovU3VidHlwZSAvVHlwZTEKL0Jhc2VGb250IC9UaW1lcy1Sb21hbgovRW5jb2RpbmcgL01hY1JvbWFuRW5jb2RpbmcKPj4KZW5kb2JqCjE0IDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9TdWJ0eXBlIC9UeXBlMQovQmFzZUZvbnQgL1RpbWVzLUJvbGQKL0VuY29kaW5nIC9NYWNSb21hbkVuY29kaW5nCj4+CmVuZG9iagoxNSAwIG9iago8PAovVHlwZSAvRm9udAovU3VidHlwZSAvVHlwZTEKL0Jhc2VGb250IC9UaW1lcy1JdGFsaWMKL0VuY29kaW5nIC9NYWNSb21hbkVuY29kaW5nCj4+CmVuZG9iagoxNiAwIG9iago8PAovVHlwZSAvRm9udAovU3VidHlwZSAvVHlwZTEKL0Jhc2VGb250IC9UaW1lcy1Cb2xkSXRhbGljCi9FbmNvZGluZyAvTWFjUm9tYW5FbmNvZGluZwo+PgplbmRvYmoKMTcgMCBvYmogCjw8Ci9DcmVhdGlvbkRhdGUgKEQ6MjAwMykKL1Byb2R1Y2VyIChGZWRFeCBTZXJ2aWNlcykKL1RpdGxlIChGZWRFeCBTaGlwcGluZyBMYWJlbCkNL0NyZWF0b3IgKEZlZEV4IEN1c3RvbWVyIEF1dG9tYXRpb24pDS9BdXRob3IgKENMUyBWZXJzaW9uIDUxMjAxMzUpCj4+CmVuZG9iagoxOCAwIG9iago8PAovVHlwZSAvUGFnZQ0vUGFyZW50IDMgMCBSCi9SZXNvdXJjZXMgPDwgL1Byb2NTZXQgNCAwIFIgCiAvRm9udCA8PCAvRjEgNSAwIFIgCi9GMiA2IDAgUiAKL0YzIDcgMCBSIAovRjQgOCAwIFIgCi9GNSA5IDAgUiAKL0Y2IDEwIDAgUiAKL0Y3IDExIDAgUiAKL0Y4IDEyIDAgUiAKL0Y5IDEzIDAgUiAKL0YxMCAxNCAwIFIgCi9GMTEgMTUgMCBSIAovRjEyIDE2IDAgUiAKID4+Ci9YT2JqZWN0IDw8IC9GZWRFeEdyb3VuZCAyMCAwIFIKL0dyb3VuZEcgMjEgMCBSCi9iYXJjb2RlMCAyMiAwIFIKPj4KPj4KL01lZGlhQm94IFswIDAgMjg4IDQzMl0KL1RyaW1Cb3hbMCAwIDI4OCA0MzJdCi9Db250ZW50cyAxOSAwIFIKL1JvdGF0ZSAwPj4KZW5kb2JqCjE5IDAgb2JqCjw8IC9MZW5ndGggMjQ2MQovRmlsdGVyIFsvQVNDSUk4NURlY29kZSAvRmxhdGVEZWNvZGVdIAo+PgpzdHJlYW0KR2F0VTY/I3M0LSY6TzpIcys9cC5CY2pqTUcsPGBoRGVZRSQ1ZWd0QC9QS0lQJThgXSxLXyJzKTNLZTIrWiomc3FnZSJBYUY3KSdCZVM5OlMKZmhHLVUqdUNLKGl0cjVAUiZtIkYtSSdqZ0leOyJCQStBMlZTaEtMYj5rOFNCLlBJVklpXChlNkAmJXBkbUE5XidgU0g8cFcqK1NZTHF0WUIKPVZ0ZCZybylORSRELmhgJDsyWikuMV1uYEclIzhRSS4/UkZdZlhDWihJdVk3JV09KiZZS2tERTVGZkZhSVFuYVtWVjE5WGxkcj0lOnBHI18KUWBuWlVxZ0hPRmwyTVYvWC9vXC5pbChhUjZdQDRSME9WPVBLKktmMTEkOCpkXFN1bDgiUCZQYlU/Kl8rUzctSmoocytLWWIjLGsoIThsNG4KbiVsaiE0bGAlS1k7LFYoUVJBdHMpOzxcVkJtdS8vZSxnVVA7dGRIYlJXXEdjWl1CISUzNGcsYlZgQE9zaFkxR05PciRPV181QUQ2KGAuSUgKV2NpTkVoNWwuRWohUldfaSNPUFVONXB1OGElcHA7RkNGYGNwM2E2YTkpKDNzOiYpQFxIP2RjK0kua04zNEIocV00OzRIZGo5cSNTbyxMIW4KbnQrTm1LW09JPDRiJ21SN3JbISRVYEBlQ002Q3Q/Kl4qa0paZz45JVkoSDBAbygoJyZNcjBKPUUrImlnUU02bFxYNmIhImFtakZuR2QnOnMKRTVzPTI/YipRLDZKOVQ8XzFVam03a2lJZidbNVY3SGRRK1RxPlRwRWE2KUlIbC9DJEoqPExYQSh1Y21BcjpLLj1SbHM+MiMrIiFgNi5lUiwKNzIyUShUQU8iZzFYRkIiSiw4ZCdtbGArRjFUI2UzaEFjMC46RUghSzhYXWE3WydCPCFuckdgdWM6Yk8tPVA4N2Q2Qz85Y19HMiJHXG81cmQKVStWdG09Z0BuOTBTLS51KlslRUZmMDNgJFw5JiE3PVwmNnAyMltxYXMzMWUsamQ/YU5EcjUiTGtIQnNHSD89SCZxbihKQm43KHA1LU1EVGkKS3QuJjktciI4TS02ZTlxNW46RlUxUWAib08sTF8rPEtdaztBSk9gVWMsT1NXYSpHSWJAbCE0V1puTEVtMUxqWi9xNUkhc1IyUi0mZik+VGcKYmxzPkQ+XDU/NTFaMWchKEtBPDkmRzchVmpnLUltJltGOydcR0JtdCNXWCIlLkhEQ1UzUywtKjgmYWhiTjhRP2k0QD9gRlhvLj5KbyVUKVMKa090QDQ4NWFvR1pLOE88UTRtVS04OyhLLzlSYkxyajpxJVQiJE4yUnMnSW8wOXMwam8yKDBdYStMVixtQ1FZcjEpNCpjJ1xBNnJHJ1x1YCoKJWg+QDI4KjkxaSYyKE1NJGctVlZNaiU/XmhcTUg2PDFJRUNOM1NOLFFqYEFxPCImJWJFQVFLVE1JQzw9ISQmKlJYRUtoM2duN0E0NDIuI1oKYC44SzY0ZVcpMyglVFcxNjNnL2U0TEE0Ik9WKiNUQnBvJjRSY0olI2BNRkpPJ0hfV0pbQ0VCZEktO2BIWzFGViYnTjpgdDprS10kJEdIXyQKLFBabWhmNjhmYTwlKE1VQ3JEXFFbUiJAdVc1L29NK2FONm5ET2g8WyteTmZuOE1lLlouOjBGKjYpLiYyPyk3YGEuXG1ebVZvNFpOYktmZDYKKVZndV5Vbz9KIU0mZjNIOkU/LEUybjUjSWZKbClCWCxeJWZIVEtvY18uOD1zMDZyUzdfIWBrNEhVayFNJTE7NDdMLWdFbS0nRDNsam1Oc0QKUUwkRyY9clxfPS5laU1bMkpSMk8mbDRbZyhbWnVdOjsqTFheZF9uXl8lZz1NSk9COm4/RWdpSTs1I3RHaWY4W2hrK2VUQDprS11sNSsrPCQKR2xeJlxHLSFpakFxN2NzPXAnbzdjdVRpZTdHSjtqPCFwbFBDJit0bjhOKDcrKCFRYDZWNS1SNSRiIS9pb2BEZUYlPkcia2VlQUhXYllvUnAKNXM+QWpbPkNob0FQVGQoJFs6RlkhXzlAOmJdUjVBaFlDREFAa1klMiEoV208OWpZdWsjZSpAa2BhOSluOTZsT2IlOkNTLyNNPG89MzxMNlkKJDgjXyRIOUtiPEZnSD1OKV0lRmlsXzBVbDFhJkxEM203Ui9eJCJHOmIiUVJwcDUvVzwlPDBmRkNwUnVNbCUmODRlPUVhQSRRTkdOZlNQcGwKKTJOcTtfZ0VDXS81dSdzQCNXczliJnJDVmkyQD9ZYCVsYEEnTSgjY2hfaG9QVSIqayVMX2Qra05QMCdkIXVxYythPkowcmpSV3RDbFVuUyMKQDRCRUIzP0NIWSg9XHBuNSZaImk7SGhmWDVzTHRsPnV0X1oyYGFsMDIwb0YzNjN1RSdBckBWOTg5S2djVzxBOiw6ZmxkK0MvY0ozOF1yTToKOUkrPDkjIiZiPFFMWm1yVVkkalFfTD9ySUpWMlc1QyMuTDpQOi0iI1lvQGo8RTpldC07QFZGRllePWFYSFZ1WjgwcipbdEhGWFM5T0MzanEKUyNJOmBXKTldPVs5PSErJ1s6Pm5XV2BuI2QuMT1VJC9eUDUmTlxuLUMyLmIrMklXVkRzLk4yakojNHQnKjZcdUhZMT06LVlyMWVnallhOE4KUjk3ZEEncCNIbW1XdDwmTl82Ulk0ZztkRkdpITlmQjdSbHRAP1NMY1NdYEQ2aCQpPTE3bWhtOVNtczBAKV91cztxTTYkSVcpXDw+PlFwMjgKUldiSTAiY2NkSls6VzRaLVU/bUpdMmw+VDs2LDwpXHRuU11gLEZbKlpVQm5ENE9PMFlvb0NQK2dvMGhrMHBfNU0rbVw4SFBjaUBrRFVgZXEKMjB0SGZzKy5Nbyg9czopaG9pUmA+P1wlZVBvdFphOUQyYjdSNThwLXFnZ2deXkE+OS1PUlQ2XUhSU0lDMChIZDplaWIyJk4hSHVAPjJfR1MKZGJOVzJicicqNCxVYXNUaGgoIzFRXkcnJjZlJ3UiTmhkX0QjM1FaSiFQQDIpLFhyV2ZtJ2dFNyUmJi1ILkpLK1FWOFFLcF4sSDZcYkZraHAKK1xILGxxX1sjMyIuSy4lRElJKjZnQzcvRzNnYzs9WEJCVUcyYT8sK08/IU85b289LUJMI0tURGUlI2JwMjRBQz0qW0JHZyNQYzpaOFhOMTgKVmAmIVpEWmFRTzVQRl9FSWMkVUkrU1phWUcoU2N+PgplbmRzdHJlYW0KZW5kb2JqCjIwIDAgb2JqCjw8IC9UeXBlIC9YT2JqZWN0Ci9TdWJ0eXBlIC9JbWFnZQovV2lkdGggMTE4Ci9IZWlnaHQgNDcKL0NvbG9yU3BhY2UgL0RldmljZUdyYXkKL0JpdHNQZXJDb21wb25lbnQgOAovTGVuZ3RoIDQ1MAovRmlsdGVyIFsvQVNDSUk4NURlY29kZSAvRmxhdGVEZWNvZGVdCj4+c3RyZWFtCkdiIi9lSkldUj8jWG5MZ1Q2PGRmL0kuJj9CPWhjRGFnLXJENF0wJVBmTVRaK2BRU0krSl1DXiZyRDNBOGxNOG5uRkZQIUkuZipqWUMyVG5bCjw3aSg3XDxKSCE8dVZ1bTNISmZrPDgpKyVaTipNZi1zJWw+VlpVQ3MsOWA5b1cmVE0lL2NnbUpVJS5mTGhiSSQnPkJndV9pQFErQyZiV3I2CjNEQ002L0ZVTXQsREJeLCpSMDBzIl1XRkdDMGo6I1dhNGdXPCpRZVQ7LD87QlMhb3J1NXUkXzNCMmpcMkMuJ2IuRlhxQFgxQSosYVxTYUdKCjpuTWtjSVFcLkpmOjA1N18tTDRKPCUyUU1tSWFvQFw4OEZLR2IxcCxtVzslLkhOQy47Vi4rYGQpczpyQmhVakxIQlgyUkNeOV9xODFuVltLCkw9MlFCRnQ7clRDbjZbZnBtcHI3U19jRyFkV1ssc1gxKys4UjwpLSVGY1Uua1JwV1MpWEU7OSs7NGxTK182QXNyY0ViUUxjSUVjXzslTUtFCjNjakdUOSpOW0oucE4yV21JOFc/JGw7YzZdNWQvP3A4dDxzRWFKMmVybCt+PgplbmRzdHJlYW0KZW5kb2JqCjIxIDAgb2JqCjw8IC9UeXBlIC9YT2JqZWN0Ci9TdWJ0eXBlIC9JbWFnZQovV2lkdGggNTQKL0hlaWdodCA1NAovQ29sb3JTcGFjZSAvRGV2aWNlR3JheQovQml0c1BlckNvbXBvbmVudCA4Ci9MZW5ndGggMTk2Ci9GaWx0ZXIgWy9BU0NJSTg1RGVjb2RlIC9GbGF0ZURlY29kZV0KPj5zdHJlYW0KR2IiME8zdTM+aCRxL00wSiglUzcsS3VZPC1zLmxILSdxRVMocFJPSENyUG4kN1o5KWE2IkxSJ1Mjb0M1OiJFbGhMJDIzJTI/Ol8nbGNZL3QKOSZDNC9OQHJPW1tFJ2piYHM+XDpQcGptNTxDLE09Jlg7byxBUWptZmFrSm1HJDBEcFQ8YC9XSENJS2RoOHA8MGtJMj9hYVVpSUwxVzMiQyEKNkRkNjZsLD5XXkhbZi49JClyTG5UaVNmSTQzQDlJPFd+PgplbmRzdHJlYW0KZW5kb2JqCjIyIDAgb2JqCjw8IC9UeXBlIC9YT2JqZWN0Ci9TdWJ0eXBlIC9JbWFnZQovV2lkdGggMjk0Ci9IZWlnaHQgNTUKL0NvbG9yU3BhY2UgL0RldmljZUdyYXkKL0JpdHNQZXJDb21wb25lbnQgOAovTGVuZ3RoIDExMTAKL0ZpbHRlciBbL0FTQ0lJODVEZWNvZGUgL0ZsYXRlRGVjb2RlXQo+PnN0cmVhbQpHYiIvYzsvUlU1JHEjMTs5NURxNjhObkcrLz9oQ3ErJi47WEM8STdjJ1daU1FJSjE1SWU5VW9kM3QnQy9vQ19HQls4Pl8sKlJzQl1jMlY7QgpGVVc5XWkpP2RTZE1gRXUpSCs8clczLCRAcSZKa2wuVmE8clNeS2BDPChwS0c7SGNbVzknSj9MYFJgZEwoMU1BODB0dFxQLjBsTj05JlVrKQpOTmIkRG9gIileXSphZi06YyFVVUVsdV9QM09ZMDxkVWMlYlchLnNqaypca09GI1opJyEpYypRLlw6b19ZYmtKXjFPWWxuald1PD87XjEvQAotQEMwJksmYClyOTUsaFxWaEJyQWk0ZiRWYiRjTSdgZC1EZ2w8bVxsNTc6SWYjKkNjYyouS2hmTSFjW2xVWlsjOSRsTWMhZ0EiUUw5IyFiQwozQjFEOUgsWSdUM2E+blVeNTY1KTdFQldGZ1MsREAqOXI+S0ZILzI0JUgzR1pVMSw+ZVFkU2UuJTgpPWcwUUs3IyomYSxUOyYzZFBoQjEwYgo2a0JkKDgiZE9rTmNsL29CRzk0azJcPENFW1ptKitGXDReXVtvcGVbQio0altTaElUJDh1KCpjYkQzLyo5UCRNOmVIZi1EJm0vOyRBIm8uNwoiOEZHVSEvJzwwPiJVXyYndWEzNFtPMjE1RC1oJiNvbU1sci44ZiJXVS87TSs0Pk8vWD4hYSlaUyZTJ2hUbVM5LVAzIjxtVjAlbyFnQm1bWAppKmJKT0pvU1tRZWcvWCcpbyZdRStaM147Jjo7aDliK2tkWzNwNnIoPExHQGFcITMzLDloTi8hYGRoa2JWXWZPSjRzXFI6Q0YyQ3JRa3ReZAo7XSRbYT8pXFUwbXRMYF5vaGlKJkVARUs5cWlvNls+UGdFcTVkPkwsa204O0dFTCNSYFMnWGNPN1IvPEtrXytkbU5zT0YzMjc6Sm5KZVsiKwpkU2RZT0JvSmxraiI1Z25NLDo3Q1s1c1NNUE5NdTlHQ05cSiRzV1dqa0txKzpfWik0KyQnSHM8VjAlY11yUThAKVkuKW5EUVRGSDddUGZnTQpQXE08VWk9X3VPRmE1RjMmXEk5YS4hK3NdYiIoUUpkVEouYj50UmNTL2dbUU0/Y09NLElKUSJaUyJwZTVPTEwiLSFqbiU8ViEvISNUSHFnNgo9WmkzTTIsXlFNQzhEbF5RZFNkQzlyVVhrR1dRMG1MPmtUcGdWT1NrTGQ2IzdXJG1jL1ElITpaOEJpQyphOi10PipYMHRZWnJHKTVINzpHQgpdOUg6P1BdMj4zNWYrQyFfaVBBYz5cI0EsaFBRMWFVLmJQR091NUNyWzJtWlpDYXFHOGYtbiVrUUk5JjImb210WzNBO3BNYWBXVEoudHAhKwpPSm5RLWxzImhVP1cpLm0xbU9tYUJxQTk7Oz5nNHJZZEhCZUZBJDxzcj47QVpycilgcT9NJ2E3fj4KZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgMjMKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNTggMDAwMDAgbiAKMDAwMDAwMDEwNCAwMDAwMCBuIAowMDAwMDAwMTYyIDAwMDAwIG4gCjAwMDAwMDAyMTQgMDAwMDAgbiAKMDAwMDAwMDMxMiAwMDAwMCBuIAowMDAwMDAwNDE1IDAwMDAwIG4gCjAwMDAwMDA1MjEgMDAwMDAgbiAKMDAwMDAwMDYzMSAwMDAwMCBuIAowMDAwMDAwNzI3IDAwMDAwIG4gCjAwMDAwMDA4MjkgMDAwMDAgbiAKMDAwMDAwMDkzNCAwMDAwMCBuIAowMDAwMDAxMDQzIDAwMDAwIG4gCjAwMDAwMDExNDQgMDAwMDAgbiAKMDAwMDAwMTI0NCAwMDAwMCBuIAowMDAwMDAxMzQ2IDAwMDAwIG4gCjAwMDAwMDE0NTIgMDAwMDAgbiAKMDAwMDAwMTYyMiAwMDAwMCBuIAowMDAwMDAxOTk5IDAwMDAwIG4gCjAwMDAwMDQ1NTIgMDAwMDAgbiAKMDAwMDAwNTE4OCAwMDAwMCBuIAowMDAwMDA1NTY5IDAwMDAwIG4gCnRyYWlsZXIKPDwKL0luZm8gMTcgMCBSCi9TaXplIDIzCi9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgo2ODY2CiUlRU9GCg=="

// let decodedBase64 = base64.base64Decode(label, 'LABEL.pdf');


// const usps = new USPS({
//     server: 'http://production.shippingapis.com/ShippingAPI.dll',
//     userId: '849XUEHU5746',
//     ttl: 10000 //TTL in milliseconds for request
//   });

//   usps.pricingRateV4({
//     Service: 'PRIORITY',
//     ZipOrigination: '92606',
//     ZipDestination: '19103',
//     Pounds :'1',
//     Ounces: '5',
//     Container:'VARIABLE',
//     Size: 'REGULAR',
//     Machinable :'true'
//   }, function(err, result) {
//     // if(err)console.log(err)
//     console.log(result);
//   });

// console.log(convert(16).from('oz').to('lb'))
// const a = {x : 1}
// const b = {y : 2}
// const c = extend(a,b)
// console.log(c)
// console.log( typeof ( moment().add(1,'days').format( "YYYY-MM-DDTHH:MM:SS").toString() ))
// console.log( moment().format( "YYYY-MM-DDTHH:MM:SS"))

// var soap = require('strong-soap').soap;
// var url = 'http://hfapiserver.hofdl.com?wsdl'  ;
// var StrPlaceName = '深圳'
// var isytle = '3'

// var url = 'http://www.webservicex.net/stockquote.asmx?WSDL';
 
// var requestArgs = {
//     APIKey:'A8BE7F3E7325EC62BE70E77343498B39',
// };
 
// var options = {};
// soap.createClient(url, options, function(err, client) {
//     if(err) console.log(err)
//     console.log(client)
    //  console.log(client)
//   var method = client['GetChannelList']
//   method(requestArgs, function(err, result, envelope, soapHeader) {
//     //response envelope
//     console.log('Response Envelope: \n' + envelope);
//     //'result' is the response body
//     console.log('Result: \n' + JSON.stringify(result));
//   });
// });
// var soap = require('soap');
// soap.createClient(url, function(err, client) {
//     if(err)console.log(err)
//     client.GetChannelList( requestArgs,function(err, result) {
//         console.log(JSON.stringify(result));
//     });
// });

//     PNG = require('pngjs').PNG;

    // var data = fs.readFileSync('test.png');
    // var png = PNG.sync.read(data);  
    // console.log(png)


//     const PDFDocument = require('pdfkit');
//     const doc = new PDFDocument;

//     doc.pipe(fs.createWriteStream('outputNew.pdf'));

//     doc.addPage()
//        .image('./test.png', {
//         fit: [500,400],
//         align: 'center',
//         valign: 'center'
// });

    // doc.image('blank.png', {
    //     fit: [800, 1200],
    //     align: 'center',
    //     valign: 'center'
    //  });
    // //  doc.addPage()
    //  doc.end();
   



    // const HummusRecipe = require('hummus-recipe');
    // const pdfDoc = new HummusRecipe('new', 'output-new.pdf');
    // pdfDoc.createPage('A4')
    // pdfDoc.image('test.png',1,1  ,
    //     { width: 300, keepAspectRatio: true}
    // )
    // .endPage()
    // // end and save
    // .endPDF();

// const pdfDoc = new HummusRecipe('output-new.pdf', 'output.pdf');
// pdfDoc
//     // edit 1st page
//     .editPage(1)
//     // .text('example-sku', 80, 1100 , {   color: '066099' ,   fontSize: 60,  })
//     // .rectangle(20, 20, 40, 100)
//     // .comment('Add 1st comment annotaion', 200, 300)
//     .image('test.png', 5, 3,{width: 200, height: 100})
//     .endPage()
//     // edit 2nd page
//     // .editPage(2)
//     // .comment('Add 2nd comment annotaion', 200, 100)
//     // .endPage()
//     // end and save
//     .endPDF();

    // const pdfDoc = new HummusRecipe('input.pdf', 'output.pdf');
// console.log(pdfDoc.metadata);

// const pdfDoc = new HummusRecipe('input.pdf', 'output.pdf');
// const longPDF = 'test.pdf';
// pdfDoc
//     // // just page 10
//     // .appendPage(longPDF, 10)
//     // // page 4 and page 6
//     // .appendPage(longPDF, [4, 6])
//     // // page 1-3 and 6-20
//     // .appendPage(longPDF, [[1, 3], [6, 20]])
//     // all pages
//     .appendPage(longPDF)
//     .endPDF();


// let order = 
// {
// 	"authorization": {
// 		"token": "f665224bd2a2b27565f17d4ed0bb13cd",
// 		"key": "f665224bd2a2b27565f17d4ed0bb13cdb342919df05b1ab44d9c160456827169"
// 	},
// 	"order": {
// 		"shippingMethodCode": "PK0006",
// 		"referenceNumber": "ck1231132132123123",
// 		"orderWeight": 0.5
// 	},
// 	"recipient": {
// 		"recipientName": "recipientName",
// 		"recipientAddress1": "recipientAddress1",
// 		"recipientCity": "recipientCity",
// 		"recipientProvince": "recipientProvince",
// 		"recipientPostCode": "recipientPostCode",
// 		"recipientCountryCode": "US",
// 		"recipientTelephone":"2155880271"
// 	},
// 		"shipper": {
// 		"shipperName": "TestByKimi",
// 		"shipperCountrycode": "US",
// 		"shipperProvince": "CA",
// 		"shipperCity": "Irvine",
// 		"shipperStreet": "shipperStreet",
// 		"shipperPostcode": "92606",
// 		"shipperTelephone": "63312345"
// 	},

// 	"declarationArr": [{
// 		"declareEnName": "NewTestByKimi",
// 		"declareQuantity": 1,
// 		"declareWeight": 3,
// 		"declareValue": 4,
// 		"declareCurrencycode": "USD",
// 		"sku": "PBK"
// 	}]
// }

// // createOrder(order)



// var concurrencyCount = 0; 
// // fetchUrl 模拟创建订单
// // var fetchUrl = function (url, callback) {
// //   var delay = parseInt((Math.random() * 10000000) % 10000, 10);//模拟创建订单耗时
// //   concurrencyCount++;
// //   console.log('现在的并发数是', concurrencyCount, '，正在生产订单的是', url, '，耗时' + delay + '毫秒');
// //   setTimeout(function () {
// //     concurrencyCount--;
// //     callback(null, url + ' 订单内容');
// //   }, delay);
// // };


// var createOrder = (order , callback) =>{
//     request({
//         method: 'POST',
//         headers: { "content-type": "application/json"},
//         url:     'http://119.23.188.252/api/v1/orders/service/create',
//         body:   JSON.stringify(order)
//       }, function(error, response, body){
//         callback(null,response.body);
//       }); 
// }

// var Orders = [];
// for(var i = 0; i < 300; i++) {
//     let order = 
//     {
//         "authorization": {
//             "token": "f665224bd2a2b27565f17d4ed0bb13cd",
//             "key": "f665224bd2a2b27565f17d4ed0bb13cdb342919df05b1ab44d9c160456827169"
//         },
//         "order": {
//             "shippingMethodCode": "PK0006",
//             "referenceNumber": `${uuid()}`,
//             "orderWeight": 0.5
//         },
//         "recipient": {
//             "recipientName": "recipientName",
//             "recipientAddress1": "recipientAddress1",
//             "recipientCity": "recipientCity",
//             "recipientProvince": "recipientProvince",
//             "recipientPostCode": "recipientPostCode",
//             "recipientCountryCode": "US",
//             "recipientTelephone":"2155880271"
//         },
//             "shipper": {
//             "shipperName": "TestByKimi",
//             "shipperCountrycode": "US",
//             "shipperProvince": "CA",
//             "shipperCity": "Irvine",
//             "shipperStreet": "shipperStreet",
//             "shipperPostcode": "92606",
//             "shipperTelephone": "63312345"
//         },
    
//         "declarationArr": [{
//             "declareEnName": "NewTestByKimi",
//             "declareQuantity": 1,
//             "declareWeight": 3,
//             "declareValue": 4,
//             "declareCurrencycode": "USD",
//             "sku": "PBK"
//         }]
//     }
//   Orders.push(order);
// }

// async.mapLimit(Orders, 200, function (order, callback) {
//    createOrder(order, callback);
// }, function (err, result) {
//   console.log('final');
//   console.log(result);//模拟返回订单信息
// });




// (async function() {
//   const instance = await phantom.create();
//   const page = await instance.createPage();
//   await page.on('onResourceRequested', function(requestData) {
//   console.info('Requesting', requestData.url);
//   });

//   const status = await page.open('https://stackoverflow.com/');
//   const content = await page.property('content');
//   const result = await page.render('stackOverFlow.pdf')
//   console.log(content);

//   await instance.exit();
// })();

// var phantom = require('phantom');   
// phantom.create().then(function(ph) {
//     ph.createPage().then(function(page) {
//         page.open("http://www.google.com").then(function(status) {
//             page.render('google.pdf').then(function() {
//                 console.log('Page Rendered');
//                 ph.exit();
//             });
//         });
//     });
// });
// let a = {b : 1}
// let b = [1,23,4]
// console.log(Array.isArray(b))



var querystring = require('querystring');
// var request = require('request');

// var form = {
//      key : "bf6759d9e27e27975dc660b83ac924a4"
// };

// // var formData = querystring.stringify(form);
// // console.log(formData)
// // var contentLength = formData.length;

// request({
//     headers: {
//     //   'Content-Length': contentLength,
//       'Content-Type': 'application/x-www-form-urlencoded'
//     },
//     form: { key: 'bf6759d9e27e27975dc660b83ac924a4' } ,
//     url: 'http://apis.juhe.cn/lottery/types',
//     method: 'POST'
//   }, function (err, res, body) {
//       console.log(body)
//     //it works!
//   });
// var options = { method: 'POST',
//   url: 'http://apis.juhe.cn/lottery/types',
//   headers: 
//    {  'Content-Type': 'application/x-www-form-urlencoded' },
//   form: { key: 'bf6759d9e27e27975dc660b83ac924a4' } };

// request(options, function (error, response, body) {
//   if (error) throw new Error(error);

//   console.log(body);
// });
