<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:ui="http://java.sun.com/jsf/facelets"
      xmlns:h="http://java.sun.com/jsf/html"
      xmlns:c="http://java.sun.com/jsp/jstl/core">

    <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Order Entry Cloud Demo</title>
        <link href="${facesContext.externalContext.requestContextPath}/resources/default/css/bootstrap.min.css" rel="stylesheet"/>
        <style>
            body {
                margin-top: 10px;
                margin-left: 5px;
                margin-right: 5px;
            }    

            .jumbotron {
                background-image: url("assets/img/Istanbul_grand_bazar_1.jpg");
                background-size: 50%;
                background-position: right;
                background-repeat: no-repeat;
            }
        </style>
        <script src="${facesContext.externalContext.requestContextPath}/assets/js/jquery-2.1.1.min.js"></script>
        <script src="${facesContext.externalContext.requestContextPath}/assets/js/bootstrap.min.js"></script>
    </head>
    <body>
        <div class="container">
            <div class="row">
                <div class="jumbotron col-sm-12">
                    <h2 class="text-primary">Order Entry Cloud Demo</h2>
                </div>
            </div>
            <div class="row panel">
                <div class="col-sm-12">
                </div>
            </div>
        </div>
        <div class="container">
            <div class="row">
                <div class="col-sm-12">
                    User '<%=request.getRemoteUser()%>' has been logged out.
                    <% session.invalidate(); %>
                    <br/><br/>
                    <a href="index.xhtml">Click here to continue shopping</a>
                </div>
            </div>
        </div>
    </body>
</html>
