public class Test {
    public static void main(String[] args) {
        System.out.println(java.util.regex.Pattern.compile("(?i)(\\bselect\\s+(?:distinct\\s+)?)\\*\\b").matcher("select * from users").replaceAll("$1__ppr_all__"));
    }
}
